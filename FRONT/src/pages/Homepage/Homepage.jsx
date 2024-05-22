import React, { useContext, useEffect, useState } from "react";
import styles from "./Homepage.module.scss";
import { UserContext } from "../../context/UserContext";
import AddVideo from "./components/AddVideo";
import AllVideos from "./components/AllVideos";

export default function Homepage() {
  const { user } = useContext(UserContext);
  // const [allVideos, setAllVideos] = useState([]);
  // useEffect(() => {
  //   async function getVideos() {
  //     try {
  //       const response = await fetch("http://localhost:5000/api/videos/getAll");
  //       const VideosList = await response.json();
  //       console.log(VideosList);
  //       setAllVideos(VideosList);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  //   getVideos();
  // }, []);

  return (
    <main className="d-flex">
      <div className={`d-flex flex-column flex-fill ${styles.leftColumn} p-10`}>
        <div className="header_space"></div>
        <AllVideos />
      </div>
      {user && (
        <div className={`d-flex flex-column ${styles.rightColumn} p-10`}>
          <div className="header_space"></div>
          <AddVideo />
        </div>
      )}
    </main>
  );
}
