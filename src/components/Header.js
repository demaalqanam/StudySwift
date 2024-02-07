import React, { useContext, useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { MyContext } from "../Context/Context";
import { auth } from "../config/firebase";
import { getAuth, signOut } from "firebase/auth";

function Header() {
  const { theme, setOverlay, setLogin, setSignup, handleRerender } =
    useContext(MyContext);
  const [showOptions, setShowOptions] = useState(false);
  // const user = auth?.currentUser;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => {
      unsubscribe(); // Unsubscribe from the onAuthStateChanged listener when component unmounts
    };
  }, []);

  //
  // Handle login and sign up actions
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
      {showOptions ? (
        <div className="logout-window">
          <div className="options">
            <button className="btn">Got to profile</button>
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
          className="profile-corner"
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
  );
}

export default Header;
