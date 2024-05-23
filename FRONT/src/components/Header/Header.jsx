import { useContext, useState } from "react";
import styles from "./Header.module.scss";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function Header() {
  const { user } = useContext(UserContext);
  const [openMenu, setOpenMenu] = useState(false);
  // console.log(user);

  async function handleBurgerMenu() {
    setOpenMenu(!openMenu);
    let overlay = document.getElementById("overlay");
    let sidebar = document.getElementById("sidebar");
    if (!openMenu) {
      overlay.style.display = "block";
      sidebar.style.transform = "translateX(0)";
    } else {
      overlay.style.display = "none";
      sidebar.style.transform = "translateX(100%)";
    }
  }

  return (
    <header className={`${styles.header} d-flex flex-row align-items-center`}>
      <div className="flex-fill">
        <NavLink end to="/">
          <strong> Video Vibe </strong>
        </NavLink>
      </div>
      <ul className={styles.headerList}>
        {user ? (
          <>
            <NavLink className="mr-15" to="profile">
              <span>Profile</span>
            </NavLink>
            <NavLink className="mr-15" to="logout">
              <span>Logout</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink className="mr-15" to="register">
              <span>Register</span>
            </NavLink>
            <NavLink className="mr-15" to="login">
              <span>Login</span>
            </NavLink>
          </>
        )}
      </ul>
      <i
        className={`fa-solid fa-bars fa-xl ${styles.headerXs}`}
        onClick={handleBurgerMenu}
      ></i>
      <div
        className={`${styles.overlay}`}
        id="overlay"
        onClick={handleBurgerMenu}
      ></div>
      <div className={`${styles.sidebar}`} id="sidebar">
        <div className={`${styles.close_sidebar}`}>
          <i
            className="fa-solid fa-xmark c-w fa-2xl pointer"
            onClick={handleBurgerMenu}
          ></i>
        </div>
        <ul className="d-flex flex-column align-items-center">
          <NavLink
            className="p-20 w-100 t-center"
            to="/"
            onClick={handleBurgerMenu}
          >
            <span>Homepage</span>
          </NavLink>
          {user ? (
            <>
              <NavLink
                className="p-20 w-100 t-center"
                to="profile"
                onClick={handleBurgerMenu}
              >
                <span>Profile</span>
              </NavLink>
              <NavLink
                className="p-20 w-100 t-center"
                to="logout"
                onClick={handleBurgerMenu}
              >
                <span>Logout</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                className="p-20 w-100 t-center"
                to="register"
                onClick={handleBurgerMenu}
              >
                <span>Register</span>
              </NavLink>
              <NavLink
                className="p-20 w-100 t-center"
                to="login"
                onClick={handleBurgerMenu}
              >
                <span>Login</span>
              </NavLink>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
