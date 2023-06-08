---
title: dodgeball login
tags: [temp-new-dodgeball-game-name, dev, game, rust, firebase, auth, oauth2, firestore]
date: 2023-05-10
project: untitled dodgeball game
description: auth is hard
---

## Actual Login

Okay, so I can get an OAuth2 access token. How do I use that to view and edit firebase data?
I know in future I'm going to need some robust access rules, but for now I'll just allow all permissions if the user is logged in.

I'll need to create a game account on login if user does not exist.

For now I'll tidy up the endpoint request code to use an authorization header rather than adding URL params.

```rust
let mut email_res_headers = HeaderMap::new();

email_res_headers.insert(
    AUTHORIZATION,
    HeaderValue::from_str(
        &("Bearer ".to_string()
            + token_response.as_ref().unwrap().access_token().secret()),
    )
    .unwrap(),
);

// Access email address endpoint
let email_res = http_client(HttpRequest {
    body: vec![],
    headers: email_res_headers,
    method: Method::GET,
    url: Url::parse("https://openidconnect.googleapis.com/v1/userinfo").unwrap(),
});
```

> I think I need to work on Rust string concatenation, that doesn't look quite right.


After poking the API for hours I've managed to convert my OAuth login to a Firebase account login.

>![](/blog/img/dodgeball/nocompile.png)
> This wouldn't compile with liquid, I don't know enough about eleventy to reason why yet. So here's a screenshot.

After running this after getting the initial OAuth token and checking my firebase authentication dashboard...

>![login.png](/blog/img/dodgeball/login.png)
> Success!

Just a bit more token juggling to go and I should be able to move on. Next target is testing [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete).

I'll set some data on firestore, and try reading it from the Rust app.

>![firestore_data.png](/blog/img/dodgeball/firestore_data.png)
> Very original naming conventions here

```rust
let url = Url::parse("https://firestore.googleapis.com/v1/projects/test-auth-rs/databases/(default)/documents/test_collection/test_document").unwrap();

let mut headers = HeaderMap::new();

headers.insert(
    AUTHORIZATION,
    HeaderValue::from_str(format!("Bearer {}", token.as_str().unwrap()).as_str())
        .unwrap(),
);

let res = http_client(HttpRequest {
    url,
    method: Method::GET,
    headers,
    body: vec![],
});

let json = match str::from_utf8(res.unwrap().body.as_ref()) {
    Ok(v) => serde_json::from_str::<serde_json::Value>(v).unwrap(),
    Err(e) => panic!("Invalid UTF-8. {:?}", e),
};

let fields = match json.get("fields") {
    Some(e) => e,
    None => &Value::Null,
};

let field = match fields.get("test_field") {
    Some(e) => e,
    None => &Value::Null,
};

let value = match field.get("stringValue") {
    Some(e) => e,
    None => &Value::Null,
};

println!("Document: {:?}\n", json);

println!("Value: {:?}\n", value);
```

>![firestore_get.png](/blog/img/dodgeball/firestore_get.png)
> Data retrieved!

This bit of code uses the Firebase IdToken to retrieve data from firestore, according to the firestore rules (non-authed requests error out correctly). I need to do some research into how to effectively navigate nested JSON in Rust, or maybe just write some helper functions. I haven't even looked at learning macros yet, maybe they'll help? I'll cross that bridge when I come to it.

Good enough for the day. Next update for this project should bring the rest of CRUD, JSON parsing, and a refactor to prepare the firestore interface for use in Bevy.

Next up: get this blog online.