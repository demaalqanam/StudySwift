import React, { useContext, useEffect, useState } from "react";
import SignUp from "../components/SignUp";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";
import {
  SlSocialFacebook,
  SlSocialInstagram,
  SlSocialTwitter,
} from "react-icons/sl";

import { auth, db } from "../config/firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { MyContext } from "../Context/Context";

function Profile() {
  const usersRef = collection(db, "users");
  const [user, setUser] = useState();
  const { setOverlay, setSignup } = useContext(MyContext);
  const [editProfileMode, setEditProfileMode] = useState(false);

  /////////////////
  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        getUserData(user);
        // User is signed in.
        setUser(user);
        console.log("Signed in", user);
      } else {
        console.log("Not Signed in");
        // No user is signed in.
      }
    });
  }, []);

  /// Get user Data
  const getUserData = async () => {
    console.log(auth.currentUser.email);
    try {
      const q = query(usersRef, where("Email", "==", auth.currentUser.email));
      const data = await getDocs(q);
      const List = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUser(List[0]);
    } catch (error) {
      console.error(error);
    }
  };

  /// Show Edit Profile
  const showEdit = () => {
    setOverlay((current) => (current === false ? true : false));
    setEditProfileMode((current) => (current === false ? true : false));
    // setSignup((current) => (current === false ? true : false));
  };

  return (
    <>
      {editProfileMode ? (
        <SignUp
          editProfileMode={true}
          setEditProfileMode={setEditProfileMode}
          currentUserData={user}
        />
      ) : (
        ""
      )}
      <div className="profile">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="6" className="mb-4 h-100 w-100 mb-lg-0">
            {user === null ? (
              <div className="loading-c center">
                <div class="spinner-border" role="status"></div>
              </div>
            ) : (
              <MDBCard className="mb-3 h-100" style={{ borderRadius: ".5rem" }}>
                <MDBRow className="g-0 h-100">
                  <MDBCol
                    md="4"
                    className="gradient-custom text-center h-100 text-white"
                    style={{
                      borderTopLeftRadius: ".5rem",
                      borderBottomLeftRadius: ".5rem",
                    }}
                  >
                    <MDBCardImage
                      src={
                        user?.profileImg === null
                          ? "https://www.alleganyco.gov/wp-content/uploads/unknown-person-icon-Image-from.png"
                          : user?.profileImg
                      }
                      alt="Avatar"
                      className="my-5"
                      style={{ width: "80px", borderRadius: "50%" }}
                      fluid
                    />
                    <MDBTypography tag="h5">{user?.fullName}</MDBTypography>
                    <MDBCardText>Student</MDBCardText>
                    <MDBIcon far icon="edit mb-5" />
                  </MDBCol>
                  <MDBCol md="8">
                    <MDBCardBody className="p-4">
                      <MDBTypography tag="h6">Information</MDBTypography>
                      <hr className="mt-0 mb-4" />
                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Email</MDBTypography>
                          <MDBCardText className="text-muted">
                            {user?.Email}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Gender</MDBTypography>
                          <MDBCardText className="text-muted">
                            {user?.Gender}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Birthday</MDBTypography>
                          <MDBCardText className="text-muted">
                            {user?.birthDate}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Phone</MDBTypography>
                          <MDBCardText className="text-muted">
                            {user?.phoneNumber}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <MDBCol>
                          <button
                            type="button"
                            class="btn primary-btn"
                            data-mdb-ripple-init
                            onClick={showEdit}
                          >
                            Edit Profile
                          </button>
                        </MDBCol>
                        <MDBCol>
                          <div className="d-flex justify-content-start">
                            <a href="#!">
                              <SlSocialFacebook className="icon" />
                            </a>
                            <a href="#!">
                              <SlSocialTwitter className="icon" />
                            </a>
                            <a href="#!">
                              <SlSocialInstagram className="icon" />
                            </a>
                          </div>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCol>
                </MDBRow>
              </MDBCard>
            )}
          </MDBCol>
        </MDBRow>
      </div>
    </>
  );
}

export default Profile;
