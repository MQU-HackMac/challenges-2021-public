import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import firebase from "firebase/app";

import {FirestoreFile} from "../interfaces";

interface ShareFileProps {
  file: FirestoreFile;
}

export const ShareFile: React.FC<ShareFileProps> = ({file}) => {
  const storage = firebase.storage();

  const download = (fileUrl: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    a.click();
  };

  const handleDownload = async () => {
    const dlUrl: string = await storage.ref(file.path).getDownloadURL();

    download(dlUrl, file.name);
    console.log(dlUrl);
  };

  return (
    <div
      className="border border-gray-400 lg:border-gray-400 bg-white
      rounded-b lg:rounded p-4 flex flex-row justify-between leading-normal"
    >
      <p className="break-all">{file.name}</p>
      <div
        className="rounded w-10 flex items-center justify-center
        hover:bg-blue-500 transition duration-200 ease-in-out cursor-pointer"
        onClick={handleDownload}
      >
        <FontAwesomeIcon icon={faDownload} />
      </div>
    </div>
  );
};
