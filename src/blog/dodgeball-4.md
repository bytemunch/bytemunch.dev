---
title: Firestore rules
tags: [temp-new-dodgeball-game-name, dev, game, firebase,  firestore, rules, data]
date: 2023-06-06
project: untitled dodgeball game
description: designing data structure and deploying rules for the dodgeball game's backend
---

## Designing data structures

Firestore stores documents, which contain fields, which hold values. Documents live in collections. Documents can hold sub-collections, but not other documents.

I've been using Firestore a fair amount over the last few years, so I should be able to design my data structures with this in mind, right? ...riiight?

I'll need to store data with many different access rights. Lobbies will need to be publicly viewable (at lobby creator's discretion), and only editable in conjunction with the correct password, which is stored in a user's private settings. I hope to hack around with data validation workflows for lobby password authentication in order to save me from needing cloud functions.


Here's some scribbles: ~(forgive\ my\ handwriting)~

> ![user collection](/blog/img/dodgeball/users_collection.png)
> First design for users collection

> ![lobby scribbles](/blog/img/dodgeball/lobby_scribbles.png)
> First design for lobby collection

You can see in these examples where the Collection/Document/Collection layout makes a bit of a mess. I despise useless names for things, like a document called 'Data', but I can't think of any better name, it stores a broad range of data.

I also cannot have a collection for RoomSettings, that'll need a document under it. RoomSettings will be publicly viewable.

~i\ think\ i\ need\ a\ spreadsheet\ for\ all\ the\ access\ rights~

>![spreadsheet detailing firestore permissions](/blog/img/dodgeball/firestore_permissions.png)
>Conditional formatting was probably a bit extra.

Once I've started to write the rules I've noticed `.../lobbySettings/settings` is superfluous, I can just use the `/lobbies/{ownerId}` document to hold the lobby settings.

Speaking of those rules, this is where I'm at now:

```rs
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  
    function isAuthed() {
      return request.auth != null;
    }

    function isUser(userId) {
      return request.auth.uid == userId;
    }

    function checkLobbyPassword(lobbyId) {
      return request.resource.data.password == get(/databases/
      $(database)/documents/users/$(lobbyId)/private/data).data.lobbyPassword;
    }

    function userInLobby(userId, lobbyId) {
      return exists(/databases/(default)/documents/lobbies/
      $(lobbyId)/connectedUsers/$(userId));
    }
    
    function userBanned(userId, lobbyId) {
      return exists(/databases/(default)/documents/lobbies/
      $(lobbyId)/bannedUsers/$(userId))
    }
    
    // user data
    match /users/{userId} {
      match /public/{document=**} {
      	allow read: if isAuthed();
        allow write: if isUser(userId);
      }
      match /private/{document=**} {
      	allow read, write: if isUser(userId);
      }
    }
    
    // lobbies
    match /lobbies/{ownerId} {
      allow read: if isAuthed();
      allow write: if isUser(ownerId);
      
      match /connectedUsers {
      	allow list: if userInLobby(request.auth.uid, ownerId);
        allow read, write: if isUser(ownerId);
        
        match /{document=**} {
          allow read: if userInLobby(request.auth.uid, ownerId);
        }
        
        match /{userId} {
          allow write: if checkLobbyPassword(ownerId) && 
          isUser(userId) && !userBanned(userId, ownerId);
          allow read, write: if isUser(ownerId);
        }
      }
      
      match /bannedUsers/{document=**} {
      	allow read, write: if isUser(ownerId);
      }
    }
  }
}
```

After testing these rules with the firestore playground, I'm fairly confident it won't leak lobby passwords. I'll need to add rate limiting to prevent brute-forcing, but this will do for now.

Refreshing tokens is next on the cards, as currently a login will only last an hour.