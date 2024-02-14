import React, { useContext, useState } from "react";
import "../Style/sass/components/Header.scss";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../Context/Context";
import { auth, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

function SignIn() {
  const { overlay, setOverlay, setLogin } = useContext(MyContext);
  const [loginWithEmail, setLoginWithEmail] = useState(false);
  const closeLogin = () => {
    setOverlay(false);
    setLogin(false);
  };

  // login with google account
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider).then((res) => {
        if (res.user !== null) closeLogin();
      });
    } catch (err) {
      console.error(err);
    }
  };

  /// Login Options Popup
  return (
    <div className=" signin-options">
      <div className="s-window">
        <IoCloseSharp onClick={closeLogin} className="close-icon" />
        <h3>Continue To StudySwift</h3>

        {loginWithEmail ? (
          LogIn(closeLogin)
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
            <a className="" href="#">
              or click here to create an account
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignIn;

function LogIn(closeLogin) {
  const { handleRerender } = useContext(MyContext);
  // Login Action
  const onLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.Password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = {
          displayName: userCredential.user.displayName,
          photo: userCredential.user.photoURL,
        };
        localStorage.setItem("uid", user.toString());
        console.log(user);
        closeLogin();
        handleRerender();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
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
