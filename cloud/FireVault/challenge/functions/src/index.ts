import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import Storage from "./Storage";
import {MAX_STORAGE_PER_USER_BYTES, MAX_USERS} from "../../config";
import Authentication from "./Authentication";
import Firestore from "./Firestore";

// import serviceAccountKey from "../serviceAccount.json";
// import firebaseConfig from "../../src/firebase.config";

// admin.initializeApp({
//   ...firebaseConfig,
//   credential: admin.credential.cert({
//     projectId: serviceAccountKey.project_id,
//     privateKey: serviceAccountKey.private_key,
//     clientEmail: serviceAccountKey.client_email,
//   }),
// });
admin.initializeApp();

export const initChallenge = functions
  .region("australia-southeast1")
  .https.onRequest(async (_request, response) => {
    // Create a new firebase user
    try {
      const user = await admin.auth().getUserByEmail("admin@hackmac.xyz");
      await admin.auth().deleteUser(user.uid);

      await Firestore.deleteUser(user.uid);
      await Storage.deleteUser(user.uid);
    } catch (error) {
      functions.logger.error(error);
    }

    const adminUser = await admin.auth().createUser({
      email: "admin@hackmac.xyz",
    });

    // Add flag file to storage
    const filePath = Storage.addFile(
      adminUser.uid,
      "flag.txt",
      functions.config().challenge.flag,
    );

    // Add a firestore share for the user
    Firestore.addSingleFileShare(
      adminUser.uid,
      Date.now(),
      Date.now() + 100 * 365 * 24 * 60 * 60 * 1000,
      "flag",
      filePath,
    );

    response.status(200).send();
  });

export const enforceMaxUsers = functions
  .region("australia-southeast1")
  .auth.user()
  .onCreate(async () => {
    Authentication.deleteOldestUser(MAX_USERS);
  });

export const deleteExpiredShares = functions
  .region("australia-southeast1")
  .pubsub.schedule("*/5 * * * *")
  .onRun(async () => {
    await Firestore.deleteExpiredShares();
  });

export const deleteExpiredSharesHttp = functions
  .region("australia-southeast1")
  .https.onRequest(async (_request, response) => {
    await Firestore.deleteExpiredShares();
    response.status(200).send();
  });

export const setUserNumShares = functions
  .region("australia-southeast1")
  .firestore.document("users/{uid}/shares/{shareId}")
  .onWrite(async (change) => {
    const userCol = change.before.ref.parent.parent;
    const shareCol = change.before.ref.parent;

    const shares = await shareCol.listDocuments();
    const numShares = shares.length;

    await userCol?.set({
      numShares: numShares,
    });
  });

/*
 * Generates a upload token with the storage left information
 * that will be used to evaluate if the file sent doesn't exceed the quota
 */
export const getUploadToken = functions
  .region("australia-southeast1")
  .https.onCall(async (data, context) => {
    try {
      const uid = context.auth?.uid;

      if (uid === undefined) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "User must be authenticated to perform this action.",
        );
      }

      const storageLeftInBytes = await Storage.storageLeftInBytes(
        uid,
        MAX_STORAGE_PER_USER_BYTES,
      );

      functions.logger.debug(
        `${storageLeftInBytes} bytes left for uid: ${uid}`,
      );

      const path: string | undefined = data.path;

      if (!path) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Invalid path.",
        );
      }

      const metadata = {
        storageLeftInBytes: storageLeftInBytes,
        storageFull: await Storage.storageFull(),
        path: path,
      };

      const token = await admin.auth().createCustomToken(uid, metadata);

      return {token};
    } catch (error) {
      console.error(error);
      throw new functions.https.HttpsError("permission-denied", error);
    }
  });
