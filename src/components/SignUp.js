import React, { useContext, useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../Context/Context";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
} from "firebase/auth";
import { storage, db } from "../config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

function SignUp({
  editProfileMode,
  currentUserData,
  setEditProfileMode,
  getUserData,
  setProfileILodaing,
}) {
  const { closeLogin, handleRerender } = useContext(MyContext);
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [signupSuccessed, setSignupSuccessed] = useState(true);
  const [email, setEmail] = useState();
  const [gender, setGender] = useState();
  const [fullName, setFullName] = useState();
  const [birthDate, setBirthDate] = useState();
  const [uploadLoading, setUploadLoading] = useState(false);

  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    fillData();
  }, []);

  /// Fill user data form
  const fillData = () => {
    if (editProfileMode) {
      setEmail(currentUserData.Email);
      setBirthDate(currentUserData.birthDate);
      setFullName(currentUserData.fullName);
      setGender(currentUserData.Gender);
      setImgUrl(currentUserData.profileImg);
    }
  };

  /// Create New User
  const createNewPofile = async (e) => {
    e.preventDefault();
    let user = auth.currentUser;
    // Update password if any
    if (e.target.Password.value !== "") {
      console.log(e.target.Password.value);
      let newPasswordd = e.target.Password.value;

      await updatePassword(auth.currentUser, newPasswordd)
        .then(() => {
          // Update successful.
          console.log("password updated");
        })
        .catch((error) => {
          console.error(error);
        });
    }

    if (editProfileMode) {
      /// Handle update profile
      const userDoc = doc(db, "users", currentUserData.id);
      await updateDoc(userDoc, {
        profileImg: imgUrl,
        fullName: fullName,
        birthDate: birthDate,
        Email: email,
      })
        .then((res) => {
          cancelSignUp();
          setProfileILodaing(true);

          // Setting user info to use everywhere
          updateProfile(auth.currentUser, {
            displayName: fullName,
            photoURL: imgUrl,
          });
        })
        .catch((err) => console.error(err));
    } else {
      // Handle create email and password for the user
      await createUserWithEmailAndPassword(
        auth,
        e.target.email.value,
        e.target.Password.value
      )
        .then((res) => {
          setSignupSuccessed(true);
          updateProfile(auth.currentUser, {
            displayName: fullName,
            photoURL: imgUrl,
          });
          try {
            addDoc(usersCollectionRef, {
              Email: email,
              Gender: e.target.gender.value,
              fullName: fullName,
              profileImg: imgUrl,
              birthDate: birthDate,
              role: "Student",
              disabled: false,
              authUID: auth.currentUser.uid,
            }).then((res) => {
              handleRerender();
            });
            cancelSignUp();
          } catch (error) {
            console.error(error);
          }
        })
        .catch((err) => {
          setSignupSuccessed(false);
          console.error(err.message);
        });
    }
  };

  const cancelSignUp = () => {
    closeLogin();
    if (setEditProfileMode) {
      setEditProfileMode(false);
      getUserData();
    }
  };

  // Upload Profile image
  const uploadProfileImg = (file) => {
    setUploadLoading(true);
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
          setUploadLoading(false);
        });
      }
    );
  };

  return (
    <div className=" SignUp">
      <div className="signup-window">
        {editProfileMode ? (
          ""
        ) : (
          <IoCloseSharp onClick={cancelSignUp} className="close-icon" />
        )}
        <h3>{editProfileMode ? "Update Profile" : "Create Your Acount."}</h3>
        <div className="profile-img position-relative">
          <div
            style={{
              top: "18%",
              display: uploadLoading ? "block" : "none",
            }}
            className="loading-c  position-absolute"
          >
            <div class="spinner-border" role="status"></div>
          </div>
          <img
            alt="profile"
            src={
              imgUrl === null
                ? "https://firebasestorage.googleapis.com/v0/b/study-swift-be3d8.appspot.com/o/files%2F2815428.png?alt=media&token=0e4e0bfc-5575-4358-baae-b8055ec2a61f"
                : imgUrl
            }
            width={90}
            height={90}
            className="p-img"
          />
          <label htmlFor="profile-img" className="btn upload-label">
            Upload Profile Picture
          </label>
          <input
            type="file"
            onChange={(e) => uploadProfileImg(e.target?.files[0])}
            hidden
            id="profile-img"
          />
        </div>
        <form onSubmit={(e) => createNewPofile(e)}>
          <div class="form-group">
            <label for="fullname">Full Name</label>
            <input
              type="text"
              class="form-control"
              id="fullname"
              aria-describedby="emailHelp"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {signupSuccessed ? (
              ""
            ) : (
              <span style={{ color: "red" }} id="emailHelp">
                The email is already in use.
              </span>
            )}
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              class="form-control"
              id="email"
            />
          </div>

          <div class="form-group">
            <label for="Password">
              {editProfileMode ? "New password" : "Password"}
            </label>
            <input type="password" class="form-control" id="Password" />
          </div>

          <div class="form-group">
            <label for="birthday">Birthday</label>
            <input
              type="date"
              class="form-control"
              id="birthday"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <select
            id="gender"
            class="form-select"
            aria-label="Default select example"
            style={{ display: editProfileMode ? "none" : "block" }}
          >
            <option selected>Gender</option>
            <option value="male">Male</option>
            <option value="famele">Famele</option>
          </select>
          <div className="create-btns">
            <button type="submit" class="btn create-btn">
              {editProfileMode ? "Update" : "Create"}
            </button>
            <button onClick={cancelSignUp} class="btn cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
