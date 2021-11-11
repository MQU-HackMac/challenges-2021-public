import "firebase/functions";

import firebase from "firebase/app";

export class Uploader {
  static async reauthenticateWithTokenAndUpload(
    file: File,
    setPercent: (percent: number) => void,
  ): Promise<string> {
    const uid = firebase.auth().currentUser?.uid;

    const destinationPath = `${uid}/${file.name}`;

    await this.reauthenticateWithTokenFor(destinationPath);
    return await this.upload(file, destinationPath, setPercent);
    // return await Storage.printStorageLeft();
  }

  /*
   * The simple token doesn't have the 'storageLeftInBytes' metadata
   * used to validate if the user has storage left to upload.
   * This method reauthenticate with this token.
   */
  static async reauthenticateWithTokenFor(
    path: string,
  ): Promise<firebase.auth.UserCredential | undefined> {
    const user = firebase.auth().currentUser;

    if (!user) {
      return;
    }

    firebase
      .app()
      .functions("austalia-southeast1")
      .useEmulator("locahost", 5001);

    const getUploadToken = firebase
      .app()
      .functions("australia-southeast1")
      .httpsCallable("getUploadToken");

    const data: {token: string} = (await getUploadToken({path})).data;

    return firebase.auth().signInWithCustomToken(data.token);
  }

  static async upload(
    file: File,
    destinationPath: string,
    setPercent: (percent: number) => void,
  ): Promise<string> {
    const uploadTask = firebase.storage().ref(destinationPath).put(file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setPercent(percent);
    });

    const snapshot = await uploadTask;

    return snapshot.ref.fullPath;
  }
}
