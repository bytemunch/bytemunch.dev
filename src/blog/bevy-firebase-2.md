---
title: bevy-firebase in action
tags: [bevy-firebase, dev, game, rust, firebase, firestore, bevy, bevy-firebase-auth, bevy-firebase-firestore]
date: 2023-07-08
project: bevy-firebase
description: pushing forward with bevy-firebase, and creating an example app
---

## Thin to Win

Before writing tests and the like, I'm going to refactor as much as I can to be as simple and error-checked as possible.

I've refined the logout systems and enabled saving refresh tokens to files for easy re-logging.

I've deleted all of the sync versions of the Firestore operation functions. They may return, but if they do it'll be after the async versions are feature complete and stable.

Sadly [pecs](https://github.com/jkb0o/pecs) has been removed, as much as I liked the promise flow, I now require [bevy-tokio-tasks](https://docs.rs/bevy-tokio-tasks/latest/bevy_tokio_tasks/) and there's no need for two dependencies to achieve async behaviour.

The way a user interacts with the library has been streamlined, now it exposes a `log_in` and `log_out` function that can be called on app `State` `OnEnter`, nice and simple.

However while trying to simplify the listener event systems I've hit a wall. I don't know how I'd like to use the listener results in an ECS context. Perhaps it may be time to try and build something alongside plugin development so I can see how the library should be written. Now *that's* scope creep, adding a whole project? Oof.

---

### Listener Events

I've finally taken the time to learn [generics](https://doc.rust-lang.org/book/ch10-01-syntax.html), and implemented a builder trait to allow for per-listener user defined events.

```rs
pub trait ListenerEventBuilder {
    fn new(msg: ListenResponse) -> Self;
}

pub fn add_listener<T>(
    ...args
) where
  T: ListenerEventBuilder + std::marker::Send + std::marker::Sync + 'static,
{

  ...listener code

  runtime.spawn_background_task(|mut ctx| async move {
    while let Some(msg) = res.next().await {
      ctx.run_on_main_thread(move |ctx| {
        ctx.world.send_event(T::new(msg.unwrap()));
      })
      .await;
    }
  }
}
```
> messy stuff, but it does what I need it to.

I still need to define the `impl ListenerEventBuilder` for custom events, but it's much better than sending all listener events through one channel and filtering them app-side.

Creating and consuming the events now looks like this:

```rs
struct MyListenerEvent {
    msg: ListenResponse,
}

impl ListenerEventBuilder for MyListenerEvent {
    fn new(msg: ListenResponse) -> Self {
        MyListenerEvent { msg }
    }
}

fn main() {
  App::new()
  ...plugins etc.
  .add_event::<MyListenerEvent>()
  .add_system(setup_listener.in_schedule(OnEnter(FirestoreState::Ready)))
  .add_system(listener_system)
  .run();
}

fn setup_listener(    
  client: ResMut<BevyFirestoreClient>,
  runtime: ResMut<TokioTasksRuntime>,
  project_id: Res<ProjectId>,) {
  
  add_listener::<MyListenerEvent>(
    &runtime,
    &mut client,
    project_id.clone(),
    document_path.clone(),
  );
}

fn test_listener_system(mut er: EventReader<MyListenerEvent>) {
  for ev in er.iter() {
    match ev.msg.response_type.as_ref().unwrap() {
      ResponseType::TargetChange(response) => { }
      ResponseType::Filter(response) => { }
      ResponseType::DocumentChange(response) => {
        println!("Document Changed: {:?}", response.document.clone().unwrap());
      }
      ResponseType::DocumentDelete(response) => {
        println!("Document Deleted: {:?}", response.document.clone());
      }
      ResponseType::DocumentRemove(response) => {
        println!("Document Removed: {:?}", response.document.clone());
      }
    }
  }
}
```

## Separation of concerns

Firebase is big. Like, very big. Even Google's own JS API is modularised now, and I think that will be the way to go with this project. Once this crate is closer to finished, I'll be aiming to split the auth and firestore components into their own crates, which leaves room for the rest of the Firebase ecosystem in more separate crates. This should also make the test writing experience markedly easier.

## Example Project: Click Game

I think I'll aim for something extremely simple as an example project. Click to increase score. No bells, no whistles.

### Login Screen

- Attempts auto login, shows button to open browser if fails

### Menu screen

- Title

- Play button

- Edit account button (nickname)

- Delete progress button

- Delete account button

### Play Screen

- Score

- Add to score button

- Submit score button

### Leaderboard Screen

- Live updating list of scores + names

That should cover most code paths.

## Using the plugin!

Through making click-game I'm finding using the plugin to be fairly straightforward. I'd prefer to not need to pass it 4 resources every call, but other than that it's simple enough to integrate. That may just be from my point of view having written it though.

---

### Using the plugin...

It can't be all good I guess. Extracting data from Documents is a real pain point at the moment, I'll have a good go at abstracting the majority of this away sometime soon.

```rs
let name: String = match name_res {
  Ok(res) => {
    let doc = res.into_inner();
    if let Some(val) = doc.fields.get("name") {
      if let Some(vt) = val.clone().value_type {
        match vt {
          ValueType::StringValue(s) => s,
          _ => "Player".into(),
        }
      } else {
        "Player".into()
      }
    } else {
      "Player".into()
    }
  }
  Err(_) => {
    "Player".into()
  }
};
```

I've also found that abstracting away the function calls is pointless, calling the `googleapis` systems directly is easier and more configurable,  and my wrapper barely saved any keystrokes. That's my inexperience with structured languages showing.

I'm running in to an issue where updating a document removes all fields not included in the update. ~~This seems to be backward behaviour according to the documentation, I'll do some deeper research and try to find out where I'm going wrong.~~

![silly docs](/blog/img/bevy-firebase/silly_docs.png)

Apparently I can't read this evening, and understood the docs backwards. `update_mask` MUST contain the fields to update, else it will put only what is in it's input into firestore, deleting all other fields. Where it said if I don't reference them in the mask, I assumed a blank mask matched lazily. It matches greedily, meaning it matched the fields I had set previously on the document, and wiped them out due to being empty on the input doc.

Turns out the abstraction could be useful for auto-inserting an update mask from the keys of the data passed in. I'll keep playing with it and see where I land on this.

Following that fiasco, I have the beginnings of a working example app.

><video controls>
><source src="/blog/img/bevy-firebase/login.webm" type="video/webm">
></video>
> We browser login now

><video controls>
><source src="/blog/img/bevy-firebase/firestore.webm" type="video/webm">
></video>
> And sending data to firestore is working too!

---

## Event driven systems

I've decided that the best way to abstract the complicated code away is to use an event based system for each operation type. The part I'm stuck on right now is getting the response. For usability, I'd prefer it be another customisable event, but I'm having endless problems trying to feed generics into the events system.

I've looked into callbacks, but I can't seem to squeak them past the borrow checker. Usually an indication that I'm doing something un-rusty somewhere.

---

After a full on war with our good friend the borrow checker, I've got a solution. It's not pretty yet, but it works. Pretty can come later.

To receive event based callbacks, the event listener needs to be running with custom Request and Response generics. Then everything works. Super messy implementing it in code, but hopefully I can shrink that all down. For general use, a default response event is sent, meaning this code works fine:

```rs
fn test(
  user_info: Res<TokenData>,

  mut document_creator: EventWriter<CreateDocumentEvent>,
) {
  let uid = user_info.local_id.clone();
  let mut data = HashMap::new();

  data.insert(
      "test_field".to_string(),
      Value {
          value_type: Some(ValueType::IntegerValue(69)),
      },
  );

  document_creator.send(CreateDocumentEvent {
      document_id: uid.clone(),
      collection_id: "lobbies".into(),
      document_data: data.clone(),
  });
}

fn response_handler(mut er: EventReader<CreateDocumentResponseEvent>) {
  for e in er.iter() {
    match e.result.clone() {
      Ok(result) => {
        println!("Document created: {:?}", result)
      }
      Err(status) => {
        println!("ERROR: Document create failed: {}", status)
      }
    }
  }
}
```

but for custom callbacks...

```rs
#[derive(Clone)]
struct CustomCreateDocumentResponseEvent {
  result: DocumentResponse,
}

impl DocResEventBuilder for CustomCreateDocumentResponseEvent {
  fn new(result: DocumentResponse) -> Self {
    CustomCreateDocumentResponseEvent { result }
  }
}

#[derive(Clone)]
struct CustomCreateDocumentEvent {
  pub document_id: String,
  pub collection_id: String,
  pub document_data: HashMap<String, Value>,
}

impl CreateDocumentEventBuilder for CustomCreateDocumentEvent {
  fn new(options: CustomCreateDocumentEvent) -> Self {
    options
  }
  fn collection_id(&self) -> String {
    self.collection_id.clone()
  }
  fn document_data(&self) -> HashMap<String, Value> {
    self.document_data.clone()
  }
  fn document_id(&self) -> String {
    self.document_id.clone()
  }
}

fn test(
  user_info: Res<TokenData>,

  mut document_creator: EventWriter<CreateDocumentEvent>,
) {
  let uid = user_info.local_id.clone();
  let mut data = HashMap::new();

  data.insert(
      "test_field".to_string(),
      Value {
          value_type: Some(ValueType::IntegerValue(69)),
      },
  );

  document_creator.send(CustomCreateDocumentEvent {
      document_id: uid.clone(),
      collection_id: "lobbies".into(),
      document_data: data.clone(),
  });
}

fn custom_response_handler(mut er: EventReader<CustomCreateDocumentResponseEvent>) {
  for e in er.iter() {
    match e.result.clone() {
      Ok(result) => {
        println!("Custom Event: Document created: {:?}", result)
      }
      Err(status) => {
        println!("ERROR: Custom Event: Document create failed: {}", status)
      }
    }
  }
}

```
> ew. Hopefully I can make this better in future with macros or something.

So now I "just" need to implement this pattern for the other three document operations and I should be much closer to open sourcing the repo.

Unfortunately I haven't had as much time as I'd like this week, so progress has been slow. I still need to look in to CI/CD, and write a README up, but I need to have at least the basic features up and running first!

I want to look into syntax highlighting for all the code in these blogs and get a bit more styling done, but I think that's another issue for another time.

Cheers for reading, ttfn.