import React, { memo, useContext, useEffect, useRef, useState } from "react";
import "../Style/sass/components/sidebar.scss";
import logo from "../assets/StudySwift_Logo.pdf.png";
import { FaHome, FaTasks, FaQuestionCircle } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { IoPlayForward } from "react-icons/io5";
import { FaGear } from "react-icons/fa6";
import SettingsWindow from "./SettingsWindow";
import { MyContext } from "../Context/Context";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../config/firebase";

export const Sidebar = memo(() => {
  const { theme, isAdmin } = useContext(MyContext);
  const [showSettings, setShowSettings] = useState(false);
  const [iconCkliked, seticonCkliked] = useState(false);
  const Link1 = useRef();
  const Link2 = useRef();
  const Link3 = useRef();
  const Link4 = useRef();
  const Link5 = useRef();
  const links = [Link1, Link2, Link3, Link4, Link5];

  const { pathname } = useLocation();

  useEffect(() => {
    activeClassCheck();
  }, []);

  /// Check Who's active
  const activeClassCheck = () => {
    const cleanPathName = pathname.substring(1);
    links.map((l) => {
      l.current?.classList.remove("active");
      if (l.current?.innerText === cleanPathName) {
        l.current?.classList.add("active");
      } else if (pathname === "/") {
        Link1.current?.classList.add("active");
      }
    });
  };

  const logoClick = () => {
    links.map((l) => {
      l.current?.classList.remove("active");
    });
    Link1.current?.classList.add("active");
  };
  const handleIconAction = () => {
    setShowSettings((current) => (current === false ? true : false));
    seticonCkliked((current) => (current === false ? true : false));
  };

  const handleNavigation = (e) => {
    links.map((l) => {
      l.current?.classList.remove("active");
    });
    e.target?.classList.add("active");
  };

  return (
    <>
      <div className=" sidebar " id={theme}>
        <div className="container">
          <div className="logo-b">
            <Link to="/" onClick={logoClick}>
              <img alt="logo" width={90} height={90} src={logo} />
            </Link>
          </div>
          <div className="side-cont">
            <div className="side-menu">
              {isAdmin ? (
                <ul>
                  <li className="">
                    <Link
                      ref={Link1}
                      onClick={(e) => handleNavigation(e)}
                      className=" active"
                      to={"/"}
                    >
                      Home
                    </Link>
                  </li>
                  <li className="">
                    <Link
                      ref={Link2}
                      onClick={(e) => handleNavigation(e)}
                      className=" "
                      to={"/Students"}
                    >
                      Manage Users
                    </Link>
                  </li>
                  <li className=" ">
                    <Link
                      className=""
                      onClick={(e) => handleNavigation(e)}
                      to={"/Faq"}
                      ref={Link3}
                    >
                      Manage FAQs
                    </Link>
                  </li>
                </ul>
              ) : (
                <ul>
                  <li className="">
                    <Link
                      ref={Link1}
                      onClick={(e) => handleNavigation(e)}
                      className=""
                      to={"/"}
                    >
                      <FaHome className="icon" />
                      Home
                    </Link>
                  </li>
                  <li className=" ">
                    <Link
                      className=""
                      onClick={(e) => handleNavigation(e)}
                      to={"/Goals"}
                      ref={Link2}
                    >
                      <GoGoal className="icon" />
                      Goals
                    </Link>
                  </li>
                  <li className=" ">
                    <Link
                      className=""
                      onClick={(e) => handleNavigation(e)}
                      ref={Link3}
                      to={"/Tasks"}
                    >
                      <FaTasks className="icon" />
                      Tasks
                    </Link>
                  </li>
                  <li className=" ">
                    <Link
                      className=""
                      onClick={(e) => handleNavigation(e)}
                      ref={Link4}
                      to={"/Sessions"}
                    >
                      <IoPlayForward className="icon" />
                      Sessions
                    </Link>
                  </li>
                  <li className=" ">
                    <Link
                      className=""
                      onClick={(e) => handleNavigation(e)}
                      ref={Link5}
                      to={"/Faq"}
                    >
                      <FaQuestionCircle className="icon" />
                      FAQ
                    </Link>
                  </li>
                </ul>
              )}
            </div>
            <div className="settings-b">
              {showSettings ? (
                <SettingsWindow setShowSettings={setShowSettings} />
              ) : (
                ""
              )}
              <div className="g-icon-c">
                <FaGear
                  className={`g-icon ${iconCkliked ? "clicked" : ""}`}
                  onClick={handleIconAction}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
