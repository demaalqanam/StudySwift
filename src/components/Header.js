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
    setOverlay,
    setLogin,
    setSignup,
    handleRerender,
    setShowTimer,
    setShowMusicPlayer,
    setShowBGChanger,
  } = useContext(MyContext);
  const [showOptions, setShowOptions] = useState(false);
  // const user = auth?.currentUser;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  console.log(pathname);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => {
      unsubscribe(); // Unsubscribe from the onAuthStateChanged listener when component unmounts
    };
  }, []);

  console.log(user);

  //
  // Show login and sign up actions
  const showLogin = () => {
    setOverlay((current) => (current === false ? true : false));
    setLogin((current) => (current === false ? true : false));
  };
  const showSignUp = () => {
    setOverlay((current) => (current === false ? true : false));
    setSignup((current) => (current === false ? true : false));
  };

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

  // loading
  if (loading) {
    return (
      <div className="loading">
        <div class="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <div className="header ">
      <div className="row justify-content-between w-100">
        <div className="col">
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
        <div className="col"></div>
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
          {user === null ? (
            <div className="signin-buttons">
              <FaQuestionCircle className="icon" />
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
              className="profile-corner gradient-custom"
            >
              <div className="img-container">
                <img
                  alt="profile"
                  src={
                    user?.photoURL === null
                      ? "https://www.alleganyco.gov/wp-content/uploads/unknown-person-icon-Image-from.png"
                      : user?.photoURL
                  }
                />
              </div>
              <h4>{user?.displayName?.split(" ")[0]}</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
