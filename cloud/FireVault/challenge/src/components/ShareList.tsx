import "../styles/ShareList.module.css";

import firebase from "firebase/app";
import {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";

import {FirestoreShare} from "../interfaces";
import {firestoreShareConverter} from "../utils/lib";
import {Share} from "./Share";

export const ShareList: React.FC = () => {
  const [shares, setShares] = useState<FirestoreShare[]>([]);
  const {addToast} = useToasts();
  const db = firebase.firestore();

  useEffect(() => {
    fetchShares();
  }, []);

  const fetchShares = () => {
    const user = firebase.auth().currentUser;

    if (!user) {
      return;
    }

    db.collection("users")
      .doc(user.uid)
      .collection("shares")
      .withConverter(firestoreShareConverter)
      .onSnapshot(
        (querySnapshot) => {
          const firestoreShares: FirestoreShare[] = querySnapshot.docs.map(
            (doc) => {
              return doc.data() as FirestoreShare;
            },
          );
          firestoreShares.sort((a, b) => {
            return b.created - a.created;
          });

          const validShares = firestoreShares.filter((share) => {
            if (share.expires <= Date.now()) {
              share.delete();
            } else {
              return share.expires > Date.now();
            }
          });

          setShares(validShares);
        },
        (error) => {
          addToast("Unable to fetch shares.", {
            appearance: "error",
            autoDismiss: true,
          });
          console.error(error);
        },
      );
  };

  return (
    <div className={"flex flex-col mb-auto"}>
      {shares.length > 0 &&
        shares.map(
          (share, i) =>
            share.firestorePath && (
              <Share key={i} firestorePath={share.firestorePath} />
            ),
        )}
    </div>
  );
};
