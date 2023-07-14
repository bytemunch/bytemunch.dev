---
title: Bevy + Firebase
tags: [bevy-firebase, dev, game, rust, firebase, oauth2, auth, bevy, bevy-firebase-auth]
date: 2023-06-14
project: bevy-firebase
description: creating a bevy plugin for firebase
---

## That's ambitious

Yeah we're getting into the weeds a bit with this one.

## The Goal

By the end of this blog post I hope to have a couple things done: Firebase Auth in Bevy, and User-Facing Firestore access from within a Bevy app. It won't be pretty, but I hope to make it work for my purposes.

## Starting off

First of all I'll refactor my testing code into something more respectable, slimming down dependencies and the like. Then I'll need to move all the functions I have currently working for the oAuth2 flow into a portable crate.

The crate will also provide the required login URL and handle the response. The crate will keep a reference to the idToken, and refresh it when needed or asked.

~uh\ wait\ how\ do\ i\ make\ a\ crate?~

## Slimming down

After learning how to make my own library crate, I'll next need to write the Bevy plugin. I'll create a resource for each of the required keys, set with the plugin's struct.

```rs
pub struct BevyFirebasePlugin {
  pub firebase_api_key: String,
  pub google_client_id: String,
  pub google_client_secret: String,
  pub firebase_refresh_token: Option<String>,
}
```

My asynchronous code doesn't work with Bevy. After a little searching I've come across [pecs](https://crates.io/pecs), which allows Promise like behaviour. Pecs also comes with it's own HTTP client, so instead of having double dependencies I'll look into completing the whole auth process with just pecs.

Easiest to port is perhaps the token refreshing function.

```rs
fn refresh_login(
  mut commands: Commands,
  refresh_token: Res<BevyFirebaseRefreshToken>,
  firebase_api_key: Res<BevyFirebaseApiKey>,
) {
  let tokens = (refresh_token.0.clone().unwrap(), firebase_api_key.0.clone());

  commands.add(
    Promise::new(tokens, asyn!(state=>{
      asyn::http::post(format!("https://securetoken.googleapis.com/v1/token?key={}",state.1))
      .header("content-type", "application/x-www-form-urlencoded")
      .body(format!("grant_type=refresh_token&refresh_token={}",state.0))
      .send()
    }))
    .then(asyn!(_state, result, mut commands:Commands=>{
      let json = serde_json::from_str::<serde_json::Value>(result.unwrap().text().unwrap()).unwrap();

      let id_token = json.get("id_token").unwrap().as_str().unwrap();

      commands.insert_resource(BevyFirebaseIdToken(id_token.into()));
    }))
  );
}
```

I'm liking working with pecs, the control flow makes sense and the builder pattern for creating HTTP requests is easy to understand.

## Full login flow

Refreshing a token works! If the plugin is given a refresh token, it inserts an ID token resource to Bevy's ECS world.

Unfortunately logging in without a refresh key is bugged *somewhere* and I've got 150 lines of basically untested code to debug. Fab.

Okay I've got the full login flow up and running! Problem is, the listening server is blocking execution, so I need to find a non-blocking solution to embed in promises, so that the app can still function while waiting for login, at least enough to display some "Waiting for browser login..." graphic and a cancel button.

After hours of trying, I found a working solution! It runs at 1fps! Playable!
I was polling `TcpListener::accept` every frame, and with no graphics it looked like it was working fine... Unfortunately I noticed it was running slow when I tried logging from a Bevy system and I could read my console.

Back to the drawing board.

## ay nice threads

Time to learn how Rust + Bevy does async. I'm hoping to spawn an async task that runs the `TcpListener::accept` server, and sends an event when it gets an auth code. So I gotta learn [crossbeam](https://docs.rs/crossbeam/latest/crossbeam/) and how [tasks](https://docs.rs/bevy/latest/bevy/tasks/index.html) work in bevy now.

I'm seeing a lot of `move` in the examples too, I should probably try to understand how it interacts with closures too.

After implementing threads, it seems I might be able to do without crossbeam. I've got the task running separately, I just need to grab the data out of the other side. I think I'll need to move the server task into a component rather than a resource? Then I'll be able to take ownership, cancel the `Future`, and extract the auth code?

>```rs
>let auth_code = future::block_on(future::poll_once(&mut task.0));
>```
> or something like that

That worked a treat. Once I got full auth flow working, I started ripping out dependencies. Apparently I don't need a whole crate with a special struct for everything in oAuth2, I can just send POST requests with plaintext bodies using pecs' built-in http client. That's a load of boilerplate gone. I don't know enough about PKCE, but I'm not sure I need to be protected against cross site request forgery (which I understand as stealing and reusing a refresh token). I'll put it on the back-burner for now and add it for tighter security later.

With all that guff deleted, I'm back to under 100 lines of working code. Nice.

Next up, I'll write some wrappers to interface with Firestore from within Bevy. I'm hoping to implement transactions that can be sent with configurable time intervals, and some sort of safety to prevent trying to hit Firestore every frame. I'm thinking Listeners will need to utilise my newfound task knowledge too.