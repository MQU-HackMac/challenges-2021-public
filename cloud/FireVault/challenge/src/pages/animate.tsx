import {DragEvent, MouseEvent, useState} from "react";

import styles from "../styles/Home.module.css";

export const Animate: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const [dropX, setDropX] = useState(0);
  const [dropY, setDropY] = useState(0);

  return (
    <main className="main">
      <div
        onDragOver={(e: DragEvent) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onDrop={(e: DragEvent) => {
          e.stopPropagation();
          e.preventDefault();
          setDropX(e.clientX);
          setDropY(e.clientY);
          setAnimate(true);
        }}
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          setDropX(e.clientX);
          setDropY(e.clientY);
          setAnimate(true);
        }}
        onAnimationEnd={() => setAnimate(false)}
        className={styles.dropCircle}
        style={{
          animationName: animate ? styles.grow : "none",
          left: animate ? dropX : "auto",
          top: animate ? dropY : "auto",
        }}
      ></div>
    </main>
  );
};

export default Animate;
