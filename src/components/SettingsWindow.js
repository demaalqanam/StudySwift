import React, { useState, useContext } from "react";
import { FaMoon, Sign } from "react-icons/fa";
import { PiSignInBold } from "react-icons/pi";
import "../Style/sass/components/SettingsW.scss";
import { MyContext } from "../Context/Context";
import ReactSwitch from "react-switch";

function SettingsWindow() {
  const { theme, setTheme } = useContext(MyContext);
  console.log(theme);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <div className=" SettingsWindow">
      <h4>Settings</h4>
      <div className="options">
        <div className="switch-btn">
          <label>Dark Mode</label>
          <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
        </div>
        <div className="signup-btn">
          <PiSignInBold className="icon" />
          <p>Sign Up</p>
        </div>
      </div>
    </div>
  );
}

export default SettingsWindow;
