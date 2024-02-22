import React, { useContext } from "react";
import "../Style/sass/components/Home.scss";
import WelcomePage from "../components/WelcomePage";
import { MyContext } from "../Context/Context";
import { auth } from "../config/firebase";
import Goals from "./Goals";
import Header from "../components/Header";
import MotivationPoup from "../components/MotivationPoup";

export const Home = () => {
  const { overlayAndLogin, setOverlay } = useContext(MyContext);

  return (
    <>
      <MotivationPoup />
      <div className="container home">
        <WelcomePage />
      </div>
    </>
  );
};
