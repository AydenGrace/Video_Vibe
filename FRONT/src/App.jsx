import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import styles from "./App.module.scss";
import { Outlet } from "react-router-dom";
import UserProvider from "./Providers/UserProvider";
import VideoProvider from "./Providers/VideoProvider";

function App() {
  return (
    <div className={`d-flex flex-column ${styles.appContainer}`}>
      <UserProvider>
        <Header />
        <VideoProvider>
          <div className="d-flex flex-fill">
            <Outlet />
          </div>
        </VideoProvider>
        <Footer />
      </UserProvider>
    </div>
  );
}
export default App;
