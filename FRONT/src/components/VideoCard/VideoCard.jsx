import React, { useEffect, useState } from "react";
import styles from "./VideoCard.module.scss";
import ReactPlayer from "react-player";
import { searchById } from "../../apis/users";

export default function VideoCard({ Video }) {
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    async function getCreator() {
      try {
        const response = await searchById(Video.creator);
        if (response) {
          setCreator(response.user);
          console.log(response.user);
        }
      } catch (e) {
        console.error(e);
      }
    }
    getCreator();
  }, []);

  return (
    <div className={`d-flex flex-column center card p-20 ${styles.element}`}>
      <ReactPlayer url={Video.url} controls={true} />
      <div className={`${styles.title_section}`}>
        <h2>{Video.title}</h2>
        <div className={`${styles.like_section}`}>
          <i className="fa-regular fa-thumbs-up"></i>
          <p>{Video.likes}</p>
          <i className="fa-regular fa-thumbs-down"></i>
          <p>{Video.dislikes}</p>
        </div>
      </div>
      {creator && (
        <div className={`${styles.creator_section}`}>
          <img src={creator.avatar} alt="Avatar" style={{ width: "30px" }} />
          {creator.username}
        </div>
      )}
    </div>
  );
}
