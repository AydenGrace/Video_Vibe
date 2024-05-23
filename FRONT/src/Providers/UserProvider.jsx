import { useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getLocalUser();
  }, []);

  async function getLocalUser() {
    const userStorage = await JSON.parse(localStorage.getItem("user"));
    if (userStorage) {
      const { token, user } = userStorage;
      if (isTokenValid(token)) {
        setUser(user);
        return user;
      } else {
        logoutConnectedUser();
        return null;
      }
    }
  }

  function logoutConnectedUser() {
    localStorage.removeItem("user");
    setUser(null);
  }

  async function updateLocalUser(NewUser) {
    let user = await JSON.parse(localStorage.getItem("user"));
    user.user = NewUser;
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(user));
  }

  function setConnectedUser(userConnected) {
    setUser(userConnected);
  }

  function isTokenValid(token) {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.exp * 1000 > new Date().getTime();
    }
    return false;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setConnectedUser,
        logoutConnectedUser,
        getLocalUser,
        updateLocalUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
