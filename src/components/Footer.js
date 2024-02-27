import React from "react";
import { BiCopyright } from "react-icons/bi";

function Footer() {
  return (
    <footer className="footer center">
      <BiCopyright />
      <p>
        All rights reserved 2024, Mabe By
        <span style={{ fontWeight: "bold" }}> Dema Alghannam.</span>,
      </p>
    </footer>
  );
}

export default Footer;
