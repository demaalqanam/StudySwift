import React, { useContext, useEffect, useState } from "react";
import SignUp from "../components/SignUp";
import {
  MDBCol,
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
import { collection, getDocs, query, where } from "firebase/firestore";
import { MyContext } from "../Context/Context";
import { Link, redirect, useNavigate } from "react-router-dom";

function Profile() {
  const usersRef = collection(db, "users");
  const [user, setUser] = useState();
  const { setOverlay, setSignup } = useContext(MyContext);
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [profileILoding, setProfileILodaing] = useState(false);
  const navigate = useNavigate();
  /////////////////
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        getUserData();
      } else {
        // No user is signed in redirect to home.
        return navigate("/");
      }
    });

    return () => {
      // Unsubscribe from onAuthStateChanged listener when component unmounts
      unsubscribe();
    };
  }, []);

  /// Get user Data
  const getUserData = async (user) => {
    try {
      const q = query(usersRef, where("Email", "==", auth.currentUser.email));
      const data = await getDocs(q);
      const List = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUser(List[0]);
      setProfileILodaing(false);
    } catch (error) {
      console.error(error);
    }
  };

  /// Show Edit Profile
  const showEdit = () => {
    setOverlay((current) => (current === false ? true : false));
    setEditProfileMode((current) => (current === false ? true : false));
  };

  return (
    <>
      {editProfileMode ? (
        <SignUp
          editProfileMode={true}
          setEditProfileMode={setEditProfileMode}
          currentUserData={user}
          getUserData={getUserData}
          setProfileILodaing={setProfileILodaing}
        />
      ) : (
        ""
      )}
      <div className="profile">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="6" className="mb-4 h-100 w-100 mb-lg-0">
            <MDBCard
              className="mb-3  position-relative h-100"
              style={{ borderRadius: ".5rem" }}
            >
              <Link to="/" className="back-btn position-absolute">
                Back to home
              </Link>
              <MDBRow className="g-0 h-100">
                <MDBCol
                  md="4"
                  className="gradient-custom position-relative text-center h-100 text-white"
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
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                    }}
                    fluid
                  />
                  {profileILoding ? (
                    <div className="loading-c p-img">
                      <div class="spinner-border" role="status"></div>
                    </div>
                  ) : (
                    ""
                  )}
                  <MDBTypography tag="h5">{user?.fullName}</MDBTypography>
                  <MDBCardText>Student</MDBCardText>
                  <MDBIcon far icon="edit mb-5" />
                </MDBCol>
                <MDBCol md="8">
                  {user === undefined ? (
                    <div className="loading-c h-100 center">
                      <div class="spinner-border" role="status"></div>
                    </div>
                  ) : (
                    <MDBCardBody className="p-4">
                      <MDBTypography tag="h6">Information</MDBTypography>
                      <hr className="mt-0 mb-4" />
                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Email</MDBTypography>
                          <MDBCardText className="">{user?.Email}</MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Gender</MDBTypography>
                          <MDBCardText className="">{user?.Gender}</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Birthday</MDBTypography>
                          <MDBCardText className="">
                            {user?.birthDate}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Phone</MDBTypography>
                          <MDBCardText className="">
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
                  )}
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </div>
    </>
  );
}

export default Profile;
