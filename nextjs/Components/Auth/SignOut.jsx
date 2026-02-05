"use client";
import React from "react";

export default function SignOut({ handleLogout }) {
  return (
    <div>
      {/* Custom Handle logout function */}
      <button onClick={handleLogout}>Logout</button>

      {/* Only for signout */}
      {/* <button onClick={() => signOut({ redirect: "/login" })}>Logout</button> */}
    </div>
  );
}
