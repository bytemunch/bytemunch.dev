---
title: dodgeball returns
tags: [dodgeball, dev, game, rust, firebase, auth, oauth2]
date: 2023-05-09
project: dodgeball
description: it's back. hopefully better.
---

## *The resurrection*

After a while learning Rust, Bevy, and Blender, I'm actively developing my multiplayer dodgeball game again! This is where I'll write about any interesting challenges I face, along with whatever hacks or solutions I use to overcome them.

## Menu State Machine

I've blocked out the main states and transitions for the game's menus.

![menu-state-machine.svg](/blog/img/dodgeball/menu-state-machine.svg)

Hopefully this will assist in creating the state machine in engine, rather than getting buried in ever-expanding spaghetti.

## User Auth

If I wanted to roll my own server systems, it might go something like this:
![hosted-topology.svg](/blog/img/dodgeball/hosted-topology.svg)
But I'm not sure, and I do not want to roll my own auth at all if I can help it.
So instead I'll be looking into using Firebase from Rust. With no official SDK this could be a fun challenge.

>![serverless-topology.svg](/blog/img/dodgeball/serverless-topology.svg)
>With game logic being P2P with GGRS, this is what the network should look like. 

According to [Google](https://developers.google.com/identity/protocols/oauth2/native-app) I should be able to use the [REST API](https://firebase.google.com/docs/reference/rest/auth) for auth, and it seems like I'll be able to use only REST for [firestore](https://firebase.google.com/docs/firestore/reference/rest) too! That's the goal. For now I'll settle on getting any application signed in with google, and try to print the email address to console.

~I have been buried in docs for hours.~

After learning how to use [oauth2](https://crates.io/crates/oauth2/) at surface level I've got...

![auth_attempt_1.png](/blog/img/dodgeball/auth_attempt_1.png)

Hmm. The info is there, but that formatting is pretty special. I'll look into getting JSON data back.

Further investigation reveals that it's already JSON. But it's escaped? This was all much easier in Typescript!

More research lead me to [serde_json](https://crates.io/crates/serde_json), and now I'm getting Rusty types in the terminal...
![auth_attempt_2.png](/blog/img/dodgeball/auth_attempt_2.png)

After a bit of hacking around:
```rust
// Access email address endpoint
let email_res = http_client(HttpRequest {
	body: vec![],
	headers: HeaderMap::new(),
	method: Method::GET,
	url: Url::parse(
	&("https://openidconnect.googleapis.com/v1/userinfo?access_token=".to_string()
	+ token_response.as_ref().unwrap().access_token().secret()),
	)
	.unwrap(),
});

let body = email_res.unwrap().body;

let json = match str::from_utf8(body.as_ref()) {
	Ok(v) => serde_json::from_str::<serde_json::Value>(v).unwrap(),
	Err(e) => panic!("Invalid UTF-8. {:?}", e),
};

let email = match json.get("email") {
	Some(e) => e,
	None => &Value::Null,
};

println!("Email: {:?}\n", email);
```

>![auth_attempt_3.png](/blog/img/dodgeball/auth_attempt_3.png)
>Extracted the email address!

That'll do for now, I need a nap to let all the OAuth2 and Google API docs sink in. I get the feeling I haven't even scratched the surface with this.