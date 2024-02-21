import React, { useState, useContext } from "react";
import { FaMoon, Sign } from "react-icons/fa";
import { PiSignInBold, PiSignOut } from "react-icons/pi";
import "../Style/sass/components/SettingsW.scss";
import { MyContext } from "../Context/Context";
import ReactSwitch from "react-switch";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

function SettingsWindow({ setShowSettings }) {
  const { theme, setTheme, handleRerender, showLogin } = useContext(MyContext);

  auth.onAuthStateChanged(function (user) {
    if (user) {
      console.log(" Signed in");

      // User is signed in.
    } else {
      console.log("Not Signed in");
      // No user is signed in.
    }
  });

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
    let nextMode = theme === "dark" ? "light" : "dark";
    localStorage.setItem("mode", nextMode);
  };

  // Logout action
  const logout = async () => {
    setShowSettings(false);
    try {
      await signOut(auth);
      handleRerender();
      localStorage.removeItem("uid");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className=" SettingsWindow">
      <h4>Settings</h4>
      <div className="options">
        <div className="switch-btn">
          <label>Dark Mode</label>
          <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
        </div>
        {auth.currentUser === null ? (
          <div
            onClick={() => {
              showLogin();
              setShowSettings(false);
            }}
            className="signup-btn"
          >
            <PiSignInBold className="icon light" />
            <p>Log in</p>
          </div>
        ) : (
          <div onClick={logout} className="signup-btn">
            <PiSignOut className="icon" />
            <p>Log out</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsWindow;
