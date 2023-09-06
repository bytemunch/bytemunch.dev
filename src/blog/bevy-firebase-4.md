---
title: releasing bevy-firebase! 
tags: [bevy-firebase, dev, game, rust, firebase, firestore, bevy, bevy-firebase-auth, bevy-firebase-firestore]
date: 2023-08-15
project: bevy-firebase
description: releasing a bevy plugin on crates.io
---

## Release time, ready or not.

I've been extremely strapped for time recently, and I haven't been able to put nearly as much effort into this plugin as I would like. In light of my newly diminished time budget, I'm releasing the plugin as-is. This post will be my thoughts on the journey through adding a crate to [crates.io](crates.io).

I mentioned in the last blog post that I'd never work on text inputs again. Ha. Spent my time between then and now working on [this PR](https://github.com/StaffEngineer/bevy_cosmic_edit/pull/9) for bevy_cosmic_edit. Still, beats trying to roll my own input for sure.

I've decided on splitting the crate by function, so far there's one for Auth and one for Firestore, leaving room for other Firebase APIs to be implemented in the future without affecting the already written code. This does unfortunately mean breaking changes in auth will trickle down to firestore, but hey we're Bevy enjoyers, we move fast and break shit and refactor for fun.

## The first step

Guess I'd better try loading the crates from disk in a separate project before doing anything else, as uploaded crates are immutable and I'd prefer to send up some working code.

---

Okay, I moved the click game example to it's own directory, opened it and... It auto logged in using my old saved credentials. That's not what I want! Uploading a refresh token is not a great idea. I'll have a play with moving the user keys directory, looks like I'll be doing some reading on correct use of cargo's directory structure.

After a bit of reading and a lot of hacking around, I'm beginning to understand where Cargo wants me to store user data. I'm only storing login data (refresh tokens for auto-login) so far, so I've opted to use [dirs](https://docs.rs/dirs/5.0.1/dirs/index.html) for platform-agnostic (at least on desktop) cache folder location, then creating a subdirectory for the package and storing the token there. I'm not sure how secure this is, but if an attacker is able to access your game login info from your user folder I feel like there's a bigger problem than me popping the token there in the first place.

*Accessing* user data is a different kettle of fish though. The plugin needs a `client-id` and `client-secret` for each OAuth2 login provider (i.e. Google, Github, Microsoft). I've set the plugin to load a `keys.ron` file in the local directory by default, but this may change if and when I find a more appropriate option. At least it solves the problem of needing hardcoded keys for now.

---

Next up is passing a `cargo test`. I'm working through all the inline docs' examples and making them compile. Wishing I could set a global doc import but I can see how that might be undesired; all docs compiling in the environment they create is a better guarantee of working examples. This step also adds some level of unit testing, which people tell me is a good thing.

I've been running into a horrible issue where the auto generated protobuf binding code has comments that are apparently interpreted by `cargo test` as doc tests. And excluding them isn't possible for whatever reason, at least not without breaking the google APIs into their own crate. Which is a good idea actually... Rust making me do things the right way again, unacceptable.

Still, ignoring the failing non-test tests, everything is passing and all public functions are documented. Nice.

I've populated the manifests, added licenses, it's all feeling ready to go. I'm going to sleep on it and release tomorrow. Then I should finally be able to move on to making [dodgeball](http://dodgeball-game.com)!

---

Surprise, had no time to work for a few days again! Totally lost my flow now, gonna check everything over one more time then run `cargo publish` with reckless abandon.

Cool, all uploaded and ready to go!

Check it out [here](/projects/bevy-firebase).
