---
title: Adding firestore
tags: [bevy-firebase, dev, game, rust, firebase, firestore, bevy]
date: 2023-06-29
project: bevy-firebase
description: adding firestore functionality to my bevy plugin
---

Now that auth works I need to implement a Bevy-friendly API wrapper for firestore access.

## Tonic needs Tokio

I've been putting off learning [tokio](https://tokio.rs/) for the longest time... But after implementing the tonic setup code, I'm coming to realise tokio is pretty much a hard requirement. Luckily [Drake Tetreault](https://github.com/EkardNT) seems to have put in the work of gluing tokio to bevy with [bevy-tokio-tasks](https://crates.io/crates/bevy-tokio-tasks). So I'll have a little refactor and work tonic in with the help of this crate.

I'll also look in to refactoring my current task spawning code, as this solution will probably be much more idiomatic.

<st></st>

Well that was easy.

>![success in the console](/blog/img/bevy-firebase/client_created.png)
> Looks like mumbo jumbo, but it means I've got gRPC working in Bevy!

<nd></nd>

## Firestoring

Now to write data operations that are callable from bevy. First thing's first though, I need to point my code at an emulator.

```rs
Channel::from_static("http://127.0.0.1:8080")
    .tls_config(tls_config)
    .unwrap()
    .connect()
    .await
    .unwrap()
```

I tried just changing the endpoint, but that... didn't work?

Oh, `http://127.0.0.1:8080` isn't going to support TLS. There's no s on my http.

```rs
Channel::from_static("http://127.0.0.1:8080")
    .connect()
    .await
    .unwrap()
```

That works.

Then I tried to write a quick test document create function. But I couldn't because of something to do with lifetimes and things escaping functions and I still don't understand how `move` works or how lifetimes work. I derived `Clone` on the client structs, passed the tokio task a clone and that worked a treat.

Got that done and adding data... didn't work. Logged the error and.. firestore rules are active. Right, yeah. I'll write my request in a way that complies with my rules.

>![working data entry](/blog/img/bevy-firebase/data_entered.png)
>data has been written to the emulator!

~is\ my\ uid\ sensitive\ info?\ dunno,\ i'll\ black\ it\ out\ just\ in\ case~

Progress is happening. Good. I'll implement all of CRUD and call it a night.

>![CRUD test working](/blog/img/bevy-firebase/crud.png)
>not pretty, but functional

<nd></nd>

I've added async versions of the data operations so they can be awaitable. I'm still playing around with how the plugin will expose it's functions, but this seems to work well for now. Users can specify the runtime, the function executes async when called. This may be the way to remove the dependency on bevy-tokio-tasks, and less dependencies is more better. Speaking of... 

## Plugin needs plugin

I've been utilising a couple of plugins within my own plugin up to now, but this is not a good way of going about things, as the plugins can only be added once. If the user wants to use the same plugin anywhere else in their app, it panics. Bad!

To solve this I'll need to await the plugins I depend on. After a bit of research it turns out plugins... don't exist?

![](/blog/img/bevy-firebase/mockersf_plugins.png)

Guess I'll await the resources then. I haven't found a good way of awaiting a resource yet, so more polling functions for now.

## Listening to Data

Let's add a listener.

>`message: "Missing required http header ('google-cloud-resource-prefix' or 'x-goog-request-params') or query param 'database'."`
>
>This error didn't show up when using the emulator, I had to test it on a live firestore instance to understand what was happening.

Let's try again after a google then. Apparently I need to put the database URI in a header? I'll quickly pop that in my `Interceptor`... And it works! Now I have a rudimentary listener that reacts when I change data on firestore. I'm going to implement bevy's `EventWriter` in the listener iterator, wrapped in a runtime, to call `run_on_main_thread`. Hopefully this all goes to plan.

~look\ at\ me\ saying\ iterator\ like\ i\ have\ a\ clue\ what's\ going\ on~

<st></st>

It all went to plan, I now have a Bevy system with an `EventReader` that responds to listener updates. Excellent.

<nd></nd>

## Create, break, repair...

After adding the listener, all my other functions seemed to break. After a bit of troubleshooting (pasting `println!`s everywhere, JavaScript is a hard drug to kick), I realised everything was working fine. The create document function was erroring out when the document already existed, breaking the control flow because I put a `?` on the end of the await. Oops.

To remedy this I've refactored my functions to return their results correctly, which allows the compiler to spot unhandled errors and notify the user.

>![](/blog/img/bevy-firebase/compiler_result_error_handling.png)
> This feels like the rust way.

## Keys 'n' Defaults

I've been working with hardcoded API keys up until now. I've moved them into files so they don't need to be committed to the repo, and while I was at it I implemented the `Default` trait for the Auth and Firestore plugins. The Auth plugin now looks at `$CARGO_MANIFEST_DIR/data/bevy-firebase/keys` for the API keys it needs, and the values can be overridden with simple `String`s.

Taking this step means I can start publishing the repo, so I can ask Bevy peeps for feedback.

~uhoh,\ now\ people\ will\ see\ my\ painfully\ amateur\ rust\ code...~

## The state of it

Polling for resources and acting when they're added: bad. State managed application: good. This will be my first look into Bevy's Stageless implementation.

So reading up on how states work, I first ran into issues trying to write bevy `0.11` code while targeting `0.10.1`. Once I figured that out though, rewriting my library to work with states was trivial. Props to everyone involved with the Stageless RFC!

So as it is now, the program will auto login if a refresh token is available, and create and display (in terminal) a login URL if not. I'd like to give a little more flexibility with this for the crate user. Developers should be able to choose when the Authorize URL is created, how it is presented, and when to use a refresh token to log in. There should also be the option to log out, and to delete refresh tokens. With the state systems already implemented, I hope to make this as easy as calling a public function that modifies the required states. 

The login URL is sent as an event, so simply listening for that event takes care of retrieving the URL.

## Repo prepping

If I want to make this repo public, I'll need to clean the history of any API keys that I hardcoded. This involved some sketchy warning ignoring, but seems to have worked. Don't copy [this approach](https://stackoverflow.com/a/63102595), there are probably much safer ways of doing things! Best practice now would be to invalidate all the keys anyway, but I'm in a test project that I'll delete entirely once this is released, so no problems there I guess? ^hope^

## Next up

 - Better developer control over systems

 - Create walkthough for retrieving required keys

 - Ensure google apis get bundled with crate

 - Public repo

Seeya next time.
