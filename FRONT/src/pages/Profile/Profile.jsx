import React from "react";
import styles from "./Profile.module.scss";
import { Link, NavLink, Outlet } from "react-router-dom";

export default function Profile() {
  return (
    <div className={`${styles.page} d-flex flex-column`}>
      <div className="header_space"></div>
      <h1>Profile</h1>
      <div className={`d-flex flex-fill ${styles.container}`}>
        <div className={`d-flex flex-fill ${styles.onglets}`}>
          <Link to={"/profile"} className={`btn btn-primary`}>
            Personal Informations
          </Link>

          <div className="d-flex flex-fill"></div>
          <NavLink to={"/logout"} className={`btn btn-reverse-primary`}>
            Disconnect
          </NavLink>
        </div>
        <div className={`d-flex flex-fill ${styles.Childs}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
