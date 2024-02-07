import React, { useContext, useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../Context/Context";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  updateCurrentUser,
  updateProfile,
} from "firebase/auth";
import { storage, db } from "../config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getDocs, collection, addDoc } from "firebase/firestore";

function SignUp() {
  const { overlay, setOverlay, setSignup } = useContext(MyContext);
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [signupSuccessed, setSignupSuccessed] = useState(true);

  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    getUsersData();
  }, []);

  /// Create New User
  const createNewPofile = async (e) => {
    e.preventDefault();

    // Handle create email and password for the user

    await createUserWithEmailAndPassword(
      auth,
      e.target.email.value,
      e.target.Password.value
    )
      .then((res) => {
        setSignupSuccessed(true);
        try {
          addDoc(usersCollectionRef, {
            Email: e.target.email.value,
            Gender: e.target.gender.value,
            fullName: e.target.fullname.value,
            profileImg: imgUrl,
            birthDate: e.target.birthday.value,
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

    // Setting user info to use everywhere
    await updateProfile(auth.currentUser, {
      displayName: e.target.fullname.value,
      photoURL: imgUrl,
    });
  };
  // Get users data
  const getUsersData = async () => {
    try {
      const data = await getDocs(usersCollectionRef);
      const usersList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(usersList);
    } catch (error) {
      console.error(error);
    }
  };
  const cancelSignUp = () => {
    setOverlay(false);
    setSignup(false);
  };

  // Upload Profile image
  const uploadProfileImg = (file) => {
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
          console.log(downloadURL);
        });
      }
    );
  };

  return (
    <div className=" SignUp">
      <div className="signup-window">
        <IoCloseSharp onClick={cancelSignUp} className="close-icon" />
        <h3>Create Your Acount.</h3>
        <div className="profile-img">
          <img
            alt="profile"
            src={
              imgUrl === null
                ? "https://www.alleganyco.gov/wp-content/uploads/unknown-person-icon-Image-from.png"
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
            <input type="email" class="form-control" id="email" />
          </div>
          <div class="form-group">
            <label for="Password">Password</label>
            <input type="password" class="form-control" id="Password" />
          </div>
          <div class="form-group">
            <label for="birthday">Birthday</label>
            <input type="date" class="form-control" id="birthday" />
          </div>
          <select
            id="gender"
            class="form-select"
            aria-label="Default select example"
          >
            <option selected>Gender</option>
            <option value="male">Male</option>
            <option value="famele">Famele</option>
          </select>
          <div className="create-btns">
            <button type="submit" class="btn create-btn">
              Create
            </button>
            <button onClick={cancelSignUp} type="submit" class="btn cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
