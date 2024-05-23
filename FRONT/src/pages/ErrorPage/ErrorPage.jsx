import React from "react";
import styles from "./ErrorPage.module.scss";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  return (
    <div className={`d-flex flex-column ${styles.appContainer}`}>
      <h1>Error {error.status}</h1>
      <h2 className="mb-10">{error.statusText}</h2>
      <Link className="btn btn-primary" to={"/"}>
        Homepage
      </Link>
    </div>
  );
}
