import "../styles/MultiFileUpload.module.css";

import {Dispatch, DragEvent, SetStateAction} from "react";
import {useState} from "react";

import styles from "../styles/Home.module.css";

interface DropAnimationProps {
  selectedFiles: File[];
  setSelectedFiles: Dispatch<SetStateAction<File[]>>;
}

export const DropAnimation: React.FC<DropAnimationProps> = ({
  selectedFiles,
  setSelectedFiles,
}) => {
  const [animate, setAnimate] = useState(false);
  const [dropX, setDropX] = useState(0);
  const [dropY, setDropY] = useState(0);

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer?.files;

    if (files) {
      const fileArr: Array<File> = [];

      for (let i = 0; i < files.length; i++) {
        console.log(files.item(i).name);
        fileArr.push(files.item(i));
      }

      setSelectedFiles(selectedFiles.concat(fileArr));
    }

    setAnimate(false);
  }

  return (
    <div
      onDrop={handleDrop}
      onClick={handleDrop}
      className="absolute left-0 top-0 w-screen h-screen z-0"
    >
      <div
        onDragOverCapture={(e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setDropX(e.clientX);
          setDropY(e.clientY);
          setAnimate(true);
        }}
        className={styles.dropCircle}
        style={{
          animationName: animate ? styles.grow : "none",
          left: animate ? dropX : "0",
          top: animate ? dropY : "0",
        }}
      />
    </div>
  );
};
