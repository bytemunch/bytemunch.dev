---
title: gRPC authenticated
tags: [dodgeball, dev, game, rust, firebase, auth, oauth2, firestore, gRPC]
date: 2023-06-05
project: dodgeball
description: implementing firestore gRPC services in rust
---

## Let's gRPC

First off I need to be able to get my oAuth tokens out of the redirect server listener I made [before](/blog/dodgeball-1).

Set redirect server to only allow one connection, synchronous networking? Yup. Now I can move all the oAuth stuff to it's own function, ready to be plugged in to other functions.

Now I have a function I can call that requests web login and returns a firebase token, we can start looking at gRPC requests.

To begin with gRPC, I'll need a gRPC client. Let's learn [tonic](https://github.com/hyperium/tonic).

I've spent more than a few hours looking for generated protobufs, but nothing seems to be working. I'll assume they're not updated to latest tonic yet, and start looking into tonic-build.

I knew I'd barely scratched the surface. Fun times.

~i\ am\ losing\ my\ miiiiiiiind~

## progress, finally

~it's\ been\ three\ days~

I bit the bullet and learned how tonic-build works, fed it the [googleapis]() and got some working rust bindings.

Then I had a fun time debugging for an hour. I forgot to add a collection ID to my gRPC request. Fun hour.

But at long last, user facing sign in, no auth scopes required. Once the firebase rules and user creation flows are up and running this code will be the foundation for cloud based bits. I still need to figure out refreshing my tokens, but this should be a good base.

I've extracted client creation to a function:
```rust
async fn create_firestore_client(
    token: String,
) -> Result<
    FirestoreClient<
        InterceptedService<
            Channel,
            impl Fn(Request<()>) -> Result<Request<()>, Status>,
            // i have no clue how this type annotation works :)
        >,
    >,
    Box<dyn Error>,
> {
    let bearer_token = format!("Bearer {}", token);
    let header_value: MetadataValue<_> = bearer_token.parse()?;

    let data_dir = PathBuf::from_iter([std::env!("CARGO_MANIFEST_DIR"), "data"]);
    let certs = read_to_string(data_dir.join("gcp/gtsr1.pem"))?;

    let tls_config = ClientTlsConfig::new()
        .ca_certificate(Certificate::from_pem(certs))
        .domain_name("firestore.googleapis.com");

    let channel = Channel::from_static(ENDPOINT)
        .tls_config(tls_config)?
        .connect()
        .await?;

    let service = FirestoreClient::with_interceptor(channel, move |mut req: Request<()>| {
        req.metadata_mut()
            .insert("authorization", header_value.clone());
        Ok(req)
    });

    return Ok(service);
}
```

Getting documents is now as simple as this:
```rust
let response: Response<Document> = service
    .get_document(Request::new(GetDocumentRequest {
        name: format!(
            "projects/{PROJECT_ID}/databases/{DATABASE_ID}/documents/{document_path}"
        ),
        ..Default::default()
    }))
    .await?;

println!("Response: {:?}\n", response);
```

With that, I have caught back up to how far I got with the REST api.

Now I need to figure out some firestore rules and data structures before trying to write data.