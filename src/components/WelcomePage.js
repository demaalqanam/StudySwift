import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context/Context";
import { auth } from "../config/firebase";

function WelcomePage() {
  const { theme } = useContext(MyContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        // Handle any errors here
        console.error("Error in onAuthStateChanged:", error);
      }
    );

    return () => {
      // Unsubscribe from onAuthStateChanged listener when component unmounts
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking authentication status
  }

  console.log(user);

  return (
    <div className="landing-info">
      <div className="info-block">
        <h2>
          {user !== null && user.displayName
            ? `Welcome ${user.displayName}`
            : "Welcome to StudySwift."}
        </h2>
        <div className="info">
          <h4>Where you can be more productive.</h4>
          <p>
            A platform to help you to study in an organized and effective way,
            where you can set goals and achieve them, play sessions with music,
            and set your daily tasks.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
