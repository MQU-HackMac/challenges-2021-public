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
