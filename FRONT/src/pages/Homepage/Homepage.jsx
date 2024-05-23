import React, { useContext, useEffect, useState } from "react";
import styles from "./Homepage.module.scss";
import { UserContext } from "../../context/UserContext";
import AddVideo from "./components/AddVideo";
import AllVideos from "./components/AllVideos";

export default function Homepage() {
  const { user } = useContext(UserContext);

  return (
    <main className={`d-flex ${styles.page}`}>
      <div className={`d-flex flex-column flex-fill ${styles.leftColumn} p-10`}>
        <div className={`${styles.header_space}`}></div>
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
