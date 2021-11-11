import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {MAX_STORAGE} from "../../config";

/**
 * Helper functions for firebase storage
 */
export default class Storage {
  /**
   * Calculate the remaining amount of storage the user is allowed in bytes
   * @param {string} uid User uid
   * @param {number} maxUserStorageBytes The maximum storage the user is
   * allowed in bytes
   * @return {Promise<number>} the number of bytes left that the user is
   * allowed
   */
  static async storageLeftInBytes(
    uid: string,
    maxUserStorageBytes: number,
  ): Promise<number> {
    const storageInBytes = await Storage.storageInBytes(uid);
    return maxUserStorageBytes - storageInBytes;
  }

  /**
   * Return the total amount of storage used by the user in bytes
   * @param {string} uid User uid
   * @return {number} total amount of storage
   */
  static async storageInBytes(uid: string): Promise<number> {
    const [files] = await admin
      .storage()
      .bucket()
      .getFiles({prefix: `${uid}/`});

    functions.logger.debug(`${files.length} files`);

    if (files.length === 0) {
      return 0;
    }

    return files
      .map((file) => Number(file.metadata.size))
      .reduce((a, b) => a + b, 0);
  }

  static async storageFull(): Promise<boolean> {
    const firestoreUsers = await admin
      .firestore()
      .collection("users")
      .listDocuments();

    const firestoreUsersWithShares = firestoreUsers.filter(
      async (firestoreUserDoc) => {
        const shares = await firestoreUserDoc
          .collection("shares")
          .listDocuments();
        return shares.length > 0;
      },
    );

    const userStorages = await Promise.all(
      firestoreUsersWithShares.map(async (firestoreUserDoc) => {
        const id = firestoreUserDoc.id;
        functions.logger.log(id);
        return Storage.storageInBytes(id);
      }),
    );

    const totalStorageUsed = userStorages.reduce((acc, curr) => acc + curr, 0);

    functions.logger.log(`Total storage used: ${totalStorageUsed} bytes`);

    return totalStorageUsed >= MAX_STORAGE;
  }

  static addFile(uid: string, filename: string, content: string): string {
    const file = admin.storage().bucket().file(`${uid}/${filename}`);
    const writeStream = file.createWriteStream();

    writeStream.write(content);
    writeStream.end();

    return `${uid}/${filename}`;
  }

  static async deleteUser(uid: string): Promise<void> {
    await admin
      .storage()
      .bucket()
      .deleteFiles({prefix: `${uid}/`});
  }
}
