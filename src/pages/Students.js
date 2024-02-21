import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { updateCurrentUser, updateProfile, deleteUser } from "firebase/auth";
import { MyContext } from "../Context/Context";

function Students() {
  const usersRef = collection(db, "users");
  const [users, setUsers] = useState();
  const navigate = useNavigate();
  const { isAdmin } = useContext(MyContext);

  useEffect(() => {
    /// Check if current user is admin
    const unsubscribe = auth.onAuthStateChanged(function (user) {
      if (isAdmin) {
        getUsers();
      } else {
        return navigate("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getUsers = async () => {
    const data = await getDocs(usersRef);
    const List = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setUsers(List);
  };

  //// Disable and enable action
  const disableUser = async (user) => {
    const userDoc = doc(db, "users", user.id);
    if (user.disabled) {
      await updateDoc(userDoc, {
        disabled: false,
      })
        .then((res) => getUsers())
        .catch((err) => console.error(err));
    } else {
      await updateDoc(userDoc, {
        disabled: true,
      })
        .then((res) => getUsers())
        .catch((err) => console.error(err));
    }
  };

  /// Handle remove action
  const removeAction = async (user) => {
    try {
      const userDoc = doc(db, "users", user?.id);
      await deleteDoc(userDoc).then(() => {
        getUsers();
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="col students">
      <div className="row p-4  s-header">
        <h3 className="center p-2">Manage Users.</h3>
      </div>
      <div className="row s-body">
        <div className="cards-list">
          {users?.map((user) => {
            return (
              <div class="card center card-cascade narrower">
                <div class="view  view-cascade ">
                  <img
                    class="card-img-top"
                    src={user.profileImg}
                    alt="Card image cap"
                  />
                  <a>
                    <div class="mask rgba-white-slight"></div>
                  </a>
                </div>

                <div class="card-body card-body-cascade">
                  <div className="m-options">
                    <button className="btn" onClick={() => disableUser(user)}>
                      {user?.disabled ? "Enable" : "Disable"}
                    </button>
                    <button onClick={() => removeAction(user)} className="btn">
                      Remove
                    </button>
                  </div>
                  <h5 class="pink-text pb-2 pt-1">{user.role}</h5>
                  <h4 class="font-weight-bold card-title">{user.fullName}</h4>
                  <p class="card-text">Email: {user.Email}</p>
                  <p class="card-text">Gender: {user.Gender}</p>
                  <p class="card-text">BirthDay: {user.birthDate}</p>
                </div>

                <div class="card-footer w-100 text-muted text-center">
                  Status:{" "}
                  {user.disabled ? (
                    <small style={{ color: "red" }}>Disabled</small>
                  ) : (
                    <small style={{ color: "green" }}>Active</small>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Students;
