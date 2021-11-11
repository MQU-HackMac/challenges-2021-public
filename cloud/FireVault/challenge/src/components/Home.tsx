import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";

import {SignOut} from "./auth/SignOut";
import {DropAnimation} from "./DropAnimation";
import {MultiFileUpload} from "./MultiFileUpload";
import {ShareList} from "./ShareList";

export const Home: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  return (
    <main className="main">
      <DropAnimation
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
      />
      <div className="flex flex-col h-full items-center justify-start z-10">
        <MultiFileUpload
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
        <ShareList />

        <div
          className="md:absolute md:left-2 md:bottom-2 px-5 py-5 flex flex-col
          text-center gap-3 z-10"
          style={{bottom: 0}}
        >
          <h1 className="text-3xl text-gray-200 font-extralight">
            🔥 FireVault 🔥
          </h1>
          <p className="text-gray-200 font-extralight">
            Made with <FontAwesomeIcon icon={faHeart} color="red" /> by{" "}
            <a className="text-blue-300" href="https://d3lta.dev">
              Jordan
            </a>
          </p>
          <SignOut />
        </div>
      </div>
    </main>
  );
};
