import * as admin from "firebase-admin";

/**
 * Helper functions for firebase firestore
 */
export default class Firestore {
  static async deleteUser(uid: string): Promise<void> {
    const userRef = admin.firestore().doc(`users/${uid}`);
    await admin.firestore().recursiveDelete(userRef);
    await userRef.delete();
  }

  static async deleteExpiredShares(): Promise<void> {
    const users = await admin.firestore().collection("users").listDocuments();

    for (const user of users) {
      const userShares = await user.collection("shares").listDocuments();

      for (const shareRef of userShares) {
        const share = await shareRef.get();

        if (share.get("expires") <= Date.now()) {
          await admin.firestore().doc(share.ref.path).delete();
        }
      }
    }
  }

  static async addSingleFileShare(
    uid: string,
    created: number,
    expires: number,
    fileName: string,
    storagePath: string,
  ): Promise<void> {
    await admin
      .firestore()
      .collection(`users/${uid}/shares`)
      .add({
        created: created,
        expires: expires,
        files: [
          {
            name: fileName,
            path: storagePath,
          },
        ],
        ownerId: uid,
      });
  }
}
