import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context/Context";
import { auth } from "../config/firebase";

function WelcomePage() {
  const { theme, setTheme } = useContext(MyContext);
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

  if (loading) {
    return;
  }
  return (
    <div className="landing-info" id={theme}>
      <div className="info-block">
        <h2>
          {" "}
          {user !== null
            ? `Welcome ${user?.displayName}`
            : "Welcome to StudySwift."}
        </h2>
        <div className="info">
          <h4>Where you can be more produvtive.</h4>
          <p>
            A platform to help you to study in an organized and effective way,
            where you can set goals and achive them, play sessions with music
            and set your daily tasks.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
