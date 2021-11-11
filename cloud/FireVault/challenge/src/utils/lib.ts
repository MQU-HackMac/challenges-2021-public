import firebase from "firebase/app";

import {FirestoreFile, FirestoreShare} from "../interfaces";

export const firestoreShareConverter = {
  toFirestore: function(firestoreShare: FirestoreShare): {
    ownerId: string;
    created: number;
    expires: number;
    files: {
      name: string;
      path?: string;
    }[];
  } {
    return {
      ownerId: firestoreShare.ownerId,
      created: firestoreShare.created,
      expires: firestoreShare.expires,
      files: firestoreShare.files.map(
        (
          file,
        ): {
          name: string;
          path?: string;
        } => {
          return {
            name: file.name,
            path: file.path,
          };
        },
      ),
    };
  },

  fromFirestore: function(
    snapshot: firebase.firestore.DocumentSnapshot,
    options: firebase.firestore.SnapshotOptions,
  ): FirestoreShare {
    const data = snapshot.data(options);
    return new FirestoreShare(
      data?.ownerId,
      data?.files.map((file: { name: string; path?: string }) => {
        return new FirestoreFile(file.name, file.path);
      }),
      data?.created,
      data?.expires,
      snapshot.id,
      snapshot.ref.path,
    );
  },
};
