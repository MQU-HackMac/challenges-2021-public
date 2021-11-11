import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import "firebase/functions";

import firebase from "firebase/app";
import {useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {ToastProvider} from "react-toast-notifications";

import {SignIn} from "../components/auth/AuthController";
import {Home} from "../components/Home";
import firebaseConfig from "../firebase.config";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

function App(): JSX.Element {
  const auth = firebase.auth();
  const [user] = useAuthState(auth);
  const db = firebase.firestore();
  const storage = firebase.storage();

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      auth.useEmulator("http://localhost:9099");
      db.useEmulator("localhost", 8080);
      storage.useEmulator("localhost", 9199);
      firebase
        .app()
        .functions("australia-southeast1")
        .useEmulator("localhost", 5001);
    }
  }, []);

  return (
    <ToastProvider autoDismiss autoDismissTimeout={6000}>
      <>
        {user ? (
          <Home />
        ) : (
          <main className="main">
            <SignIn />
          </main>
        )}
      </>
    </ToastProvider>
  );
}

export default App;
