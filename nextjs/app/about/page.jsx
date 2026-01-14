import Link from "next/link";
import React from "react";

export default function About() {
  return (
    <div>
      About
      <p>
        Back to home : <Link href={"/"}>Home</Link>
      </p>
    </div>
  );
}
