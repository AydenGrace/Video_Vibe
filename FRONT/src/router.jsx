import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Homepage from "./pages/Homepage/Homepage";
import Register from "./pages/Forms/Register";
import Login from "./pages/Forms/Login";
import Profile from "./pages/Profile/Profile";
import Logout from "./components/Logout";
import UserConnected from "./components/ProtectedRoutes/UserConnected";
import UserNotConnected from "./components/ProtectedRoutes/UserNotConnected";
import Forgot_Pwd from "./pages/Forms/Forgot_Pwd";
import Change_Pwd from "./pages/Forms/Change_Pwd";
import Informations from "./pages/Profile/components/Informations";
import { videoLoader } from "./loaders/videoLoader";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: videoLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "/register",
        element: (
          <UserNotConnected>
            <Register />
          </UserNotConnected>
        ),
      },
      {
        path: "/login",
        element: (
          <UserNotConnected>
            <Login />
          </UserNotConnected>
        ),
      },
      {
        path: "/forgot_password",
        element: (
          <UserNotConnected>
            <Forgot_Pwd />
          </UserNotConnected>
        ),
      },
      {
        path: "/change_password/:token",
        element: <Change_Pwd />,
      },
      {
        path: "/profile",
        element: (
          <UserConnected>
            <Profile />
          </UserConnected>
        ),
        children: [
          {
            index: true,
            element: <Informations />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: "/logout",
        element: (
          <UserConnected>
            <Logout />
          </UserConnected>
        ),
      },
    ],
  },
]);
