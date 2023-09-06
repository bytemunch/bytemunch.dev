---
title: head meet wall
tags: [dodgeball, dev, game, rust, firebase, auth, oauth2, firestore, gRPC]
date: 2023-06-01
project: dodgeball
description: man loses mind ft. firestore + gRPC
---

## thoughtstream

Let's start checking off the list of CRUD operations. Last update we got reading data working, so only three operations to go! I'll start by putting the read system into it's own function.

Ah, I'm rusty ~haha~ and just spent half an hour fighting the borrow checker. 

After a little research into using serde with firestore, I've found a wealth of crates that do what I'm trying to accomplish! Unfortunately they all seem to work with service accounts in mind, and I need per-user granularity for the firestore rules to work as planned.

I'll have a play with [googapis](https://github.com/mechiru/googapis) and see if my current auth tokens will work? ~~Nope, service account focused.~~ Turns out the project targets old tonic.

I've also learned that REST is old hat now, and I should use gRPC instead. [Tonic](https://github.com/hyperium/tonic) is apparently the way forward.

Once I've got my head around all this I should be ready to utilise [firestore-serde](https://crates.io/crates/firestore-serde), and my JSON parsing nightmares should cease.

~several\ hours\ of\ documentation\ reading\ later...~

I feel like I'm struggling so much with the auth side of the API because of foundational gaps in my knowledge when it comes to HTTP requests and RPC.

Okay so nah fuck all that noise, I'm going to see if the [firestore](https://crates.io/crates/firestore) crate will accept a JWT, as I already have access to that token.

Passing my token as credentials with that crate didn't work. I'm just going to roll my own for now. 

So new plan: auth using REST and then firestore over RPC, as the REST API has no listening ability, and I would like the lobby browser to auto update. Polling sounds both expensive and cumbersome.

Rolling my own signalling server is looking more and more appealing, but I really don't want to deal with user authentication. And I'd probably need to learn RPC for that anyway.

I'll try this all again tomorrow, I need to let all the reading sink in.

Target for next update is an authenticated RPC request to firestore.