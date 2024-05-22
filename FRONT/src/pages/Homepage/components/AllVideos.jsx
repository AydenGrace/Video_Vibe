import React, { useContext, useEffect, useState } from "react";
import styles from "./AllVideos.module.scss";
import VideoCard from "../../../components/VideoCard/VideoCard";
import { VideoContext } from "../../../context/VideoContext";

export default function AllVideos() {
  const {allVideos} = useContext(VideoContext);

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
