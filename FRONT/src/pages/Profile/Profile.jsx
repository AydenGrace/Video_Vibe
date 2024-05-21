import React from "react";
import styles from "./Profile.module.scss";
import { NavLink, Outlet } from "react-router-dom";

export default function Profile() {
  return (
    <div className={`${styles.page} d-flex flex-column`}>
      <div className="header_space"></div>
      <h1>Profil</h1>
      <div className={`d-flex flex-fill`}>
        <div className={`d-flex flex-fill ${styles.onglets}`}>
          <NavLink to={"/profile"} className={`btn btn-primary`}>
            Informations personnelles
          </NavLink>

          <div className="d-flex flex-fill"></div>
          <NavLink to={"/logout"} className={`btn btn-reverse-primary`}>
            Déconnexion
          </NavLink>
        </div>
        <div className={`d-flex flex-fill ${styles.Childs}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
