import React, { useContext, useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { MyContext } from "../Context/Context";
import { auth } from "../config/firebase";
import { getAuth, signOut } from "firebase/auth";
import { SiApplemusic } from "react-icons/si";
import { RxLapTimer } from "react-icons/rx";
import { FaImage } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const {
    showLogin,
    showSignUp,
    handleRerender,
    setShowTimer,
    setShowMusicPlayer,
    setShowBGChanger,
  } = useContext(MyContext);
  const [showOptions, setShowOptions] = useState(false);
  // const user = auth?.currentUser;
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(1);
  const { pathname } = useLocation();

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setLoading(false);
        setUser(user);
        console.log("user loged in");
        // User is signed in.
      } else {
        console.log("Not Signed in");
        // No user is signed in.
      }
    });
  }, []);

  //

  // Logout action
  const logout = async () => {
    try {
      await signOut(auth);
      handleRerender();
      setShowOptions(false);
      localStorage.removeItem("uid");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="header ">
      <div className="row justify-content-between w-100">
        <div className="col d-flex align-items-center">
          <Link to="/Faq">
            <FaQuestionCircle className="icon" />
          </Link>
          <div
            style={{
              display: `${pathname !== "/Sessions" ? "none" : "block"}`,
            }}
            className="session-tools"
          >
            <div className="tools-cont">
              <button onClick={() => setShowBGChanger(true)} className="btn">
                <FaImage className="icon" />
              </button>
              <button onClick={() => setShowTimer(true)} className="btn">
                <RxLapTimer className="icon" />
              </button>
              <button onClick={() => setShowMusicPlayer(true)} className="btn">
                <SiApplemusic className="icon" />
              </button>
            </div>
          </div>
        </div>

        <div className="col d-flex justify-content-end">
          {showOptions ? (
            <div className="logout-window">
              <div className="options">
                <Link
                  onClick={() => setShowOptions(false)}
                  className="btn"
                  to={"/Profile"}
                >
                  Go to profile.
                </Link>
                <button className="btn" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
          {auth.currentUser === null ? (
            <div className="signin-buttons">
              <button onClick={showLogin} className="btn signin-b">
                Log In
              </button>
              <button onClick={showSignUp} className="btn signup-b">
                Sign up
              </button>
            </div>
          ) : (
            <div
              onClick={() =>
                setShowOptions((current) => (current === true ? false : true))
              }
              className="profile-corner "
            >
              <div
                style={{
                  top: "23%",
                  display: auth.currentUser === null ? "block" : "none",
                }}
                className="loading-c  position-absolute"
              >
                <div class="spinner-border" role="status"></div>
              </div>
              <div className="img-container">
                <img
                  alt="profile"
                  src={
                    auth.currentUser?.photoURL === null
                      ? "https://firebasestorage.googleapis.com/v0/b/study-swift-be3d8.appspot.com/o/files%2Fillustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg?alt=media&token=84c8b9da-2856-45df-b812-dfeb4ad2f902"
                      : auth.currentUser?.photoURL
                  }
                />
              </div>
              <h4>
                {auth.currentUser.displayName === null
                  ? "Student"
                  : auth.currentUser?.displayName?.split(" ")[0]}
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
