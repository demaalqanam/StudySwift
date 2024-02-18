import React from "react";
import { ImFileEmpty } from "react-icons/im";
import { auth } from "../config/firebase";

function Empty() {
  return (
    <div className="empty flex-column h-100 w-100 center">
      <ImFileEmpty style={{ width: "40px", height: "40px" }} className="icon" />
      <h3 className="m-0 mt-2">Empty</h3>
      {auth.currentUser === null ? (
        <p className="mt-1">Please log in or sign up to see the data.</p>
      ) : (
        "No data yet."
      )}
    </div>
  );
}

export default Empty;
