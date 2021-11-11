import {faClipboard, faTimesCircle} from "@fortawesome/free-regular-svg-icons";
import {faList} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import firebase from "firebase/app";
import moment from "moment";
import {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";

import {FirestoreShare} from "../interfaces";
import {firestoreShareConverter} from "../utils/lib";
import {ShareFile} from "./SharedFile";

type ShareProps = {
  firestorePath: string;
};

export const Share: React.FC<ShareProps> = ({firestorePath}) => {
  const [selected, setSelected] = useState(false);
  const [shareData, setShareData] = useState<FirestoreShare>();
  const [hovered, setHovered] = useState(false);
  const {addToast} = useToasts();
  const db = firebase.firestore();

  useEffect(() => {
    try {
      db.doc(firestorePath)
        .withConverter(firestoreShareConverter)
        .get()
        .then((snapshot) => {
          const data = snapshot.data();
          console.log(data);
          setShareData(data);
        });
    } catch (error) {
      addToast(error.message, {appearance: "error"});
    }
  }, [firestorePath]);

  const handleCopy = async () => {
    console.log("copied");

    await navigator.clipboard.writeText(
      `${window.location.origin}/shares/${firestorePath}`,
    );
  };

  const handleDelete = async () => {
    try {
      await FirestoreShare.delete(firestorePath);
      console.log("Deleted");
    } catch (error) {
      addToast(error.message, {appearance: "error"});
    }
  };

  const getDateTimeString = (timestamp: number) => {
    // moment.relativeTimeRounding((value) => Math.round(value* 100)/100);
    moment.relativeTimeThreshold("ss", 1);
    const date = moment(timestamp);
    return moment(date).fromNow();
  };

  return (
    <>
      {shareData && (
        <div
          onMouseEnter={() => {
            setHovered(true);
          }}
          onMouseLeave={() => {
            setHovered(false);
          }}
          className="py-1 max-w-sm w-full lg:min-w-md flex flex-col px-4"
        >
          {firebase.auth().currentUser?.uid ===
            shareData?.firestorePath?.split("/")[1] &&
            hovered && (
            <div className="relative">
              <FontAwesomeIcon
                icon={faTimesCircle}
                title="Delete share"
                className="absolute transform scale-125 cursor-pointer"
                onClick={handleDelete}
              />
            </div>
          )}
          <div
            className="border border-gray-400 lg:border-gray-400 bg-white
            rounded lg:rounded p-4 flex justify-between leading-normal"
          >
            <div className="flex items-center justify-center flex-row gap-5">
              <div className="text-sm text-center">
                <p className="text-gray-900 leading-none mb-2 ">Created</p>
                <p className="text-gray-600">
                  {shareData && getDateTimeString(shareData.created)}
                </p>
              </div>
              <div className="text-sm text-center">
                <p className="text-gray-900 leading-none mb-2">Expires</p>
                <p className="text-gray-600">
                  {shareData && getDateTimeString(shareData?.expires)}
                </p>
              </div>
              <div
                className="rounded h-full w-10 flex items-center justify-center
                hover:bg-blue-500 transition duration-200 ease-in-out
                cursor-pointer"
                onClick={() => {
                  setSelected(!selected);
                }}
              >
                <FontAwesomeIcon title="Show shared files" icon={faList} />
              </div>
              {firebase.auth().currentUser?.uid ===
                firestorePath.split("/")[0] && (
                <div
                  className="rounded h-full w-10 flex items-center
                  justify-center hover:bg-blue-500 transition duration-200
                  ease-in-out cursor-pointer"
                  onClick={handleCopy}
                >
                  <FontAwesomeIcon
                    title="Copy share link to clipboard"
                    icon={faClipboard}
                  />
                </div>
              )}
            </div>
          </div>
          {selected &&
            shareData &&
            shareData.files.map((file, i) => <ShareFile key={i} file={file} />)}
        </div>
      )}
    </>
  );
};
