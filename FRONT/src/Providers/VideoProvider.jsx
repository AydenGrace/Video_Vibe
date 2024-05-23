import { useEffect, useState } from "react";
import { VideoContext } from "../context/VideoContext";
import { Link, useLoaderData } from "react-router-dom";

export default function VideoProvider({ children }) {
  const [allVideos, setAllVideos] = useState(useLoaderData());

  function addNewVideo(video) {
    setAllVideos([...allVideos, video]);
  }

  function updateVideo(video) {
    const temp = allVideos.map((vid, i) => {
      if (vid._id === video._id) return video;
      else return vid;
    });
    setAllVideos(temp);
  }

  return (
    <VideoContext.Provider value={{ allVideos, addNewVideo, updateVideo }}>
      {children}
    </VideoContext.Provider>
  );
}
