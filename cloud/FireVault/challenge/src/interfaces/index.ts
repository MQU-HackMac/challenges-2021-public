import * as crypto from "crypto";
import firebase from "firebase/app";

import {SHARE_LIFETIME_MILLIS} from "../../config";
import {firestoreShareConverter} from "../utils/lib";

/**
 * @description Firestore Share
 * @export
 */
export class FirestoreShare {
  id?: string;
  firestorePath?: string;
  ownerId: string;
  files: FirestoreFile[];
  created: number;
  expires: number;

  /**
   * @description Firestore Share Constructor
   * @param {string} ownerId
   * @param {FirestoreFile[]} files
   * @param {number} created
   * @param {number} expires
   * @param {string} id
   * @param {string} firestorePath
   * @memberof FirestoreShare
   * @constructor
   */
  constructor(
    ownerId: string,
    files: FirestoreFile[],
    created: number,
    expires: number,
    id?: string,
    firestorePath?: string,
  ) {
    this.id = id;
    this.firestorePath = firestorePath;
    this.ownerId = ownerId;
    this.files = files;
    this.created = created;
    this.expires = expires;
  }

  /**
   * @description Delete the share from Firestore and Storage
   */
  async delete(): Promise<void> {
    if (this.firestorePath === undefined) {
      return;
    }

    const db = firebase.firestore();

    await db.doc(this.firestorePath).delete();
    const shareData = await db
      .doc(this.firestorePath)
      .withConverter(firestoreShareConverter)
      .get()
      .then((snapshot) => {
        return snapshot.data();
      });

    if (shareData === undefined) {
      return;
    }

    try {
      shareData.files.forEach(async (file) => {
        await firebase.storage().ref(file.path).delete();
      });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @description Delete the share from Firestore and Storage
   * @return {Promise<void>}
   * @memberof FirestoreShare
   * @static
   * @param {string} firestorePath
   */
  static async delete(firestorePath: string): Promise<void> {
    if (!firestorePath) {
      return;
    }

    const db = firebase.firestore();

    const shareData = await db
      .doc(firestorePath)
      .withConverter(firestoreShareConverter)
      .get()
      .then((snapshot) => {
        return snapshot.data();
      });

    if (shareData === undefined) {
      return;
    }

    try {
      shareData.files.forEach(async (file) => {
        await firebase.storage().ref(file.path).delete();
      });
      await db.doc(firestorePath).delete();
    } catch (error) {
      console.error(error);
    }
  }
}

/**
 * @description Firestore File
 * @export
 * @interface FirestoreFile
 * @property {string} name
 * @property {string} path
 */
export class FirestoreFile {
  name: string;
  path?: string;

  /**
   * @description Firestore File Constructor
   * @param {string} name
   * @param {string} path
   * @memberof FirestoreFile
   * @constructor
   */
  constructor(name: string, path?: string) {
    this.name = name;
    this.path = path;
  }
}

/**
 * @description Share File
 *
 * @export
 * @interface ShareFile
 * @property {File} blob
 * @property {string} storagePath
 * @property {string} fileName
 */
export class ShareFile {
  blob: File;
  storagePath?: string;
  fileName: string;

  /**
   * @description Share File Constructor
   * @param {File} file
   * @constructor
   * @memberof ShareFile
   */
  constructor(file: File) {
    this.blob = file;
    this.fileName = file.name;
  }

  /**
   * @description Generate a hash for the file
   * @return {string}
   * @memberof ShareFile
   */
  async hash(): Promise<string> {
    let hash = "";

    try {
      const fileText = await this.blob.text();
      const shasum = crypto.createHash("sha256");
      hash = shasum.update(fileText).digest("hex");
    } catch (error) {
      hash = "";
    }

    return hash;
  }
}

/**
 * @description Share File
 * @export
 * @interface ShareFile
 * @property {ShareFile[]} files
 * @property {number} created
 * @property {number} expires
 */
export class Share {
  files: ShareFile[] = [];
  created: number;
  expires: number;

  /**
   * @description Share File Constructor
   * @constructor
   * @param {File[]} files
   */
  constructor(files: File[]) {
    this.created = Date.now();
    this.expires = this.created + SHARE_LIFETIME_MILLIS;
    // this.expires = +this.created + 10 * 1000;

    files.forEach((file) => {
      this.files.push(new ShareFile(file));
    });
  }
}
