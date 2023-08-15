---
title: emulating firebase
tags: [bevy-firebase, dev, game, rust, firebase, firestore, bevy, bevy-firebase-auth, bevy-firebase-firestore]
date: 2023-07-20
project: bevy-firebase
description: pointing my bevy plugin at local emulators in preparation for tests
---

## Bevy 0.11.0

A new [Bevy update](https://bevyengine.org/news/bevy-0-11/) is out...

...my plugin requires migration...

...but the [migration guide](https://bevyengine.org/learn/migration-guides/0.10-0.11/) is comprehensive and easy to follow!

---

## Back to business

Now that I'm up to date, time to get back to adding features. First off, I want to get the leaderboard in the click game example up and running, and I get the feeling this will require a structured query. Excuse me while I jump back into the docs.

---

Implementing that was simple enough. I'm liking using the Event system for calling and responding to Firestore calls, but it's a LOT of repeated code. I'm making a mental note to see if macros can reduce some of the footprint; Tantan's [video](https://www.youtube.com/watch?v=ModFC1bhobA) has inspired a deep dive into the world of meta-programming. But for now, there are simpler things to do.

## Name Input

The click game has a `set name` button, but no text input. Let's add one.

<video controls>
<source src="/blog/img/bevy-firebase/text_input.webm" type="video/webm">
</video>

Cool, that works. Let's never do that again though, egui is getting learned next time I need text input.

## Emulate Everything

I've been working with a test project on Firebase whilst getting the plugin working, but running tests against a live database sounds like a terrible idea. Firebase provides [emulators](https://firebase.google.com/docs/emulator-suite) for a lot of the APIs I'm trying to interface with, so let's get set up with them. Firestore already works, but Auth is all live right now.

### Finding Endpoints

Google's [docs](https://firebase.google.com/docs/reference/rest/auth#section-auth-emulator) mention REST endpoints for the auth emulator, but only provide like four? There are a whole lot of extra endpoints I'll need to emulate to be able to test effectively.

---

After a bit of digging I loaded up the emulator URL in a browser, and was greeted with this:

```json
{
  "authEmulator": {
    "ready": true,
    "docs": "https://firebase.google.com/docs/emulator-suite",
    "apiSpec": "/emulator/openapi.json"
  }
}
```

Okay, so what's in the apiSpec path of the emulator? It's the whole spec. Every endpoint, listed in JSON. Excellent. Now I can start testing. I'll add an `EmulatorUrl` option to the plugin like the firestore one, and try signing in. I have a feeling that starting with oAuth2 is gonna bite me here, but let's give it a go anyway.

`CODE 501: The Auth Emulator only support sign-in with google.com using id_token, not access_token. Please update your code to use id_token.`

Okay, but it beats the errors I was getting before. `404` from guessing endpoints, and `400` by sending `String("true")` as a bool. Works in production, the emulator wants an actual JSON bool.

After switching to using `id_token`, I've successfully logged in to the emulator using Google oAuth!

## More Signin Providers

I want to allow for the freedom of using all sign-in providers with the plugin. After some reading, it seems I'll need a separate `Client Secret` and `Client ID` for each provider. A quick rewrite of the auth plugin is in order if I am to facilitate other providers than Google. That's not to mention email/password login, and perhaps anonymous "login" for warm onboarding.

This would be a breaking change if I had released already. Luckily I haven't :P

---

After a whole day of refactoring, then refactoring the refactoring to make it sensible, I've come away with working Github login.

<video controls>
<source src="/blog/img/bevy-firebase/github-login.mp4" type="video/mp4">
</video>

---

That's enough for this post I guess, as it's now a month later and I still haven't published this oooopsie! See you in the next one.

