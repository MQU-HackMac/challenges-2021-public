import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

import firebase from "firebase/app";
import {useRouter} from "next/router";
import {ToastProvider} from "react-toast-notifications";

import {Share} from "../../../components/Share";
import firebaseConfig from "../../../firebase.config";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export const SharedShare: React.FC = () => {
  const router = useRouter();
  const {userId, shareId} = router.query;

  return (
    <ToastProvider autoDismiss autoDismissTimeout={6000}>
      <main className="main">
        <Share firestorePath={`users/${userId}/shares/${shareId}`} />
      </main>
    </ToastProvider>
  );
};

export default SharedShare;
