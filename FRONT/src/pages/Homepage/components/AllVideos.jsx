import React, { useEffect, useState } from "react";
import styles from "./AllVideos.module.scss";
import VideoCard from "../../../components/VideoCard/VideoCard";

export default function AllVideos() {
  const [allVideos, setAllVideos] = useState([]);
  useEffect(() => {
    async function getVideos() {
      try {
        const response = await fetch("http://localhost:5000/api/videos/getAll");
        const Videos = await response.json();

        setAllVideos(Videos);
        console.log(Videos);
      } catch (e) {
        console.log(e);
      }
    }
    getVideos();
  }, []);
  return (
    <section className={`${styles.section}`}>
      <h1>AllVideos</h1>
      {allVideos && (
        <div>
          {allVideos.map((vid) => (
            <VideoCard Video={vid} key={vid._id} />
          ))}
        </div>
      )}
    </section>
  );
}
