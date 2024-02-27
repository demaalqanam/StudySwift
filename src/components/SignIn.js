import React, { useContext, useState } from "react";
import "../Style/sass/components/Header.scss";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../Context/Context";
import { auth, db, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

function SignIn() {
  const { closeLogin, showSignUp } = useContext(MyContext);
  const [loginWithEmail, setLoginWithEmail] = useState(false);
  const usersCollectionRef = collection(db, "users");
  const [isError, setIsError] = useState({ is: false, message: "" });

  // login with google account
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider).then((res) => {
        console.log(res.user);
        if (res.user !== null) {
          closeLogin();
          checkAndCreate(res.user);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  /// Check and create
  const checkAndCreate = async (user) => {
    try {
      const q = query(usersCollectionRef, where("Email", "==", user?.email));
      const data = await getDocs(q);
      const List = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(List);
      if (List?.length !== 0) {
        return "";
      } else {
        /// Create a user profile if he is new
        try {
          addDoc(usersCollectionRef, {
            Email: user?.email,
            Gender: "",
            fullName: user?.displayName,
            profileImg: user?.photoURL,
            birthDate: "",
          });
          closeLogin();
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  /// Login Options Popup
  return (
    <div className=" signin-options">
      <div className="s-window">
        <IoCloseSharp onClick={closeLogin} className="close-icon" />
        <h3>Continue To StudySwift</h3>

        {loginWithEmail ? (
          LogIn(closeLogin, isError, setIsError, usersCollectionRef)
        ) : (
          <div className="options">
            <div className="options-cont">
              <button onClick={() => setLoginWithEmail(true)} className="btn ">
                Sign in with Email
              </button>
              <button onClick={signInWithGoogle} className="btn ">
                Sign in with Google
              </button>
            </div>
            <a className=" black" onClick={showSignUp}>
              or click here to create an account
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignIn;

function LogIn(closeLogin, isError, setIsError, usersCollectionRef) {
  // Login Action
  const onLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.Password.value;

    /// Check if the user active or disabled
    const q = query(usersCollectionRef, where("Email", "==", email));
    const data = await getDocs(q);
    const user = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))[0];
    console.log(user);
    if (user?.disabled) {
      console.log("User is Blocked");
      setIsError({ is: true, message: "User is blocked!" });
    } else {
      // Signed in
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = {
            displayName: userCredential.user.displayName,
            photo: userCredential.user.photoURL,
          };
          localStorage.setItem("uid", user.toString());
          console.log(user);
          closeLogin();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          setIsError({ is: true, message: "Wrong email or password!" });
        });
    }
  };
  return (
    <div className="login">
      <form onSubmit={(e) => onLogin(e)}>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" class="form-control" id="email" />
        </div>
        <div class="form-group">
          <label for="Password">Password</label>
          <input type="password" class="form-control" id="Password" />
        </div>
        <small
          style={{ color: "red" }}
          className={isError.is ? "d-block" : "d-none"}
        >
          {isError.message}
        </small>
        <div className="login-btns">
          <button type="submit" class="btn login-btn">
            Log In
          </button>
          <button onClick={closeLogin} type="submit" class="btn cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
