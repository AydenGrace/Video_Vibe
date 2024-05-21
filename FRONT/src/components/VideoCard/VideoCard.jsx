import React from "react";
import styles from "./VideoCard.module.scss";
import ReactPlayer from "react-player";

export default function VideoCard({ Video }) {
  return (
    <div className={`d-flex flex-column center card p-20 ${styles.element}`}>
      <ReactPlayer url={Video.url} controls={true} />
      <div className={`${styles.title_section}`}>
        <h2>{Video.title}</h2>
        <div className={`${styles.like_section}`}>
          <i class="fa-regular fa-thumbs-up"></i>
          <p>{Video.likes}</p>
          <i class="fa-regular fa-thumbs-down"></i>
          <p>{Video.dislikes}</p>
        </div>
      </div>
    </div>
  );
}
