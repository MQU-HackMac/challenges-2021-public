import "../styles/MultiFileUpload.module.css";

import firebase from "firebase/app";
import {Line} from "rc-progress";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {ChangeEvent} from "react";
import {useToasts} from "react-toast-notifications";

import {
  MAX_FILES_PER_SHARE,
  MAX_SHARES,
  MAX_STORAGE_PER_USER_BYTES,
} from "../../config";
import {FirestoreFile, FirestoreShare, Share} from "../interfaces";
import {firestoreShareConverter} from "../utils/lib";
import {Uploader} from "../utils/uploader";
import {SelectedFileList} from "./SelectedFileList";

interface MultiFileUploadProps {
  selectedFiles: File[];
  setSelectedFiles: Dispatch<SetStateAction<File[]>>;
}

export const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  selectedFiles,
  setSelectedFiles,
}) => {
  const [uploadingFile, setUploadingFile] = useState<{
    name: string;
    progress: number;
  } | null>();
  const {addToast} = useToasts();
  const db = firebase.firestore();

  useEffect(() => {
    uploadingFile?.progress === 100 && setUploadingFile(null);
  }, [uploadingFile]);

  const saveShare = async (share: Share) => {
    const user = firebase.auth().currentUser;

    if (!user) {
      return;
    }

    const firestoreShare: FirestoreShare = new FirestoreShare(
      user.uid,
      share.files.map((file) => {
        return new FirestoreFile(file.fileName, file.storagePath);
      }),
      share.created,
      share.expires,
    );

    try {
      await db
        .collection("users")
        .doc(user.uid)
        .collection("shares")
        .withConverter(firestoreShareConverter)
        .add(firestoreShare);
    } catch (error) {
      addToast(String(error), {appearance: "error", autoDismiss: true});
      console.log(firestoreShare);
    }
  };

  const uploadFiles = async (share: Share) => {
    const user = firebase.auth().currentUser;

    if (!user) {
      return;
    }

    for (let i = 0; i < share.files.length; i++) {
      const file = share.files[i];

      const ext = "" || file.fileName.split(".").pop();
      const path = `${user.uid}/${await file.hash()}.${ext}`;
      console.log(path);

      const setPercent = (percent: number) => {
        setUploadingFile({
          name: file.fileName,
          progress: percent,
        });
      };

      const fullPath = await Uploader.reauthenticateWithTokenAndUpload(
        file.blob,
        setPercent,
      );
      console.log("Started upload of a blob or file!");

      file.storagePath = fullPath;
      console.log("Upload finished");
    }
    setUploadingFile(null);
  };

  const handleSubmission = async () => {
    if (selectedFiles.length === 0) {
      console.log("No files to submit");
      return;
    }

    console.log("Submitting...");
    const share = new Share(selectedFiles);
    setSelectedFiles([]);

    try {
      await uploadFiles(share);
    } catch (error) {
      const token = await firebase.auth().currentUser?.getIdTokenResult();

      if (token?.claims.storageFull) {
        addToast("Storage is full. Please contact Admin.", {
          appearance: "error",
          autoDismiss: true,
        });
        console.error(error);
      } else if (
        token?.claims.storageLeftInBytes <
        share.files.reduce((a, c) => {
          return a + c.blob.size;
        }, 0)
      ) {
        addToast(
          "You have no more storage left. Your total storage quota is " +
            `${Math.floor(MAX_STORAGE_PER_USER_BYTES / 1000000)} MB.`,
          {
            appearance: "error",
            autoDismiss: true,
          },
        );
      } else {
        addToast(String(error), {appearance: "error", autoDismiss: true});
        console.error(error);
      }
      console.log(error);
      setUploadingFile(null);
      return;
    }

    try {
      await saveShare(share);
    } catch (error) {
      addToast("Unable to save share", {
        appearance: "error",
        autoDismiss: true,
      });
      console.log(error);
      return;
    }

    console.log("Submitted...");
  };

  const handleClear = () => {
    setSelectedFiles([]);
    console.log("Cleared");
  };

  const changeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    const user = firebase.auth().currentUser;

    if (!user) {
      return;
    }

    let numShares = MAX_SHARES;
    try {
      numShares = (await db.collection("users").doc(user.uid).get()).data()
        ?.numShares;
    } catch (error) {
      addToast(error.message, {appearance: "error"});
    }

    if (numShares >= MAX_SHARES) {
      const message = `You may only have up to ${MAX_SHARES} active shares.`;
      console.error(message);
      addToast(message, {appearance: "warning", autoDismiss: true});
      setSelectedFiles([]);
      return;
    }

    if (files !== null) {
      const fileArr: Array<File> = [];
      let totalSize = 0;

      if (files.length > MAX_FILES_PER_SHARE) {
        const message =
          `You may have up to ${MAX_FILES_PER_SHARE}` + "files in a share.";
        console.error(message);
        addToast(message, {appearance: "warning", autoDismiss: true});
        setSelectedFiles([]);
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const curFile = files.item(i);
        if (curFile !== null) {
          console.log(curFile.name);

          totalSize += curFile.size;

          fileArr.push(curFile);
        }
      }

      if (totalSize > MAX_STORAGE_PER_USER_BYTES) {
        const message =
          "Share size is too large. Your total storage quota " +
          `is ${Math.floor(MAX_STORAGE_PER_USER_BYTES / 1000000)} MB.`;
        console.error(message);
        addToast(message, {appearance: "warning", autoDismiss: true});
        setSelectedFiles([]);
        return;
      }

      setSelectedFiles(fileArr);
    }
  };

  return (
    <>
      <div
        className={`mt-auto grid ${
          selectedFiles.length !== 0 ? "grid-cols-3" : "grid-cols-1"
        } gap-12 py-8 px-5`}
      >
        <input
          type="file"
          name="file"
          id="file-select-btn"
          onChange={changeHandler}
          multiple
          hidden
        />
        <button id="submit-button" onClick={handleSubmission} hidden></button>
        <button id="clear-button" onClick={handleClear} hidden></button>

        <label
          title="Select or drop files to upload"
          htmlFor="file-select-btn"
          className="btn btn-blue grid"
        >
          Choose Files
        </label>
        {selectedFiles.length !== 0 && (
          <>
            <label
              title="Upload selected files"
              htmlFor="submit-button"
              className="btn btn-blue grid content-center"
            >
              Upload
            </label>
            <label
              title="Clear files selected for upload"
              htmlFor="clear-button"
              className="btn btn-blue grid content-center"
            >
              Clear Files
            </label>
          </>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="pb-4">
          <SelectedFileList selectedFiles={selectedFiles} />
        </div>
      )}
      {uploadingFile && (
        <div className="pb-4">
          <p className="text-white text-center pb-2">{uploadingFile.name}</p>
          <Line
            percent={uploadingFile.progress}
            strokeWidth={1}
            strokeLinecap="round"
            strokeColor="#3B82F6"
          />
        </div>
      )}
    </>
  );
};
