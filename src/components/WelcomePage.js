import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context/Context";
import { auth } from "../config/firebase";

function WelcomePage() {
  const { isAdmin } = useContext(MyContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error("Error in onAuthStateChanged:", error);
      }
    );
    return () => {
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
            ? `Welcome ${isAdmin ? "Admin" : ""} ${user.displayName}`
            : "Welcome to StudySwift."}
        </h2>
        <div className="info">
          {isAdmin ? (
            <h4>Manage Students accounts and FAQs.</h4>
          ) : (
            <h4>Where you can be more productive.</h4>
          )}
          {isAdmin ? (
            <p>
              You're an admin in StydySwift you can edit, delete and block
              studnets accounts and all FAQs data ordinary stuents accounts have
              no access to these data and functions.
            </p>
          ) : (
            <p>
              A platform to help you to study in an organized and effective way,
              where you can set goals and achieve them, play sessions with
              music, and set your daily tasks.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
