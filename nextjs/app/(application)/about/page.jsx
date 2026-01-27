"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function About() {
  const [fruit, setFruit] = useState(["Mango", "Apple"]);
  return (
    <div>
      About
      <p>
        Back to home : <Link href={"/"}>Home</Link>
      </p>
      {fruit.map((item) => (
        <p key={item}> {item}</p>
      ))}
      // for cause the error
      <button onClick={() => setFruit(null)}>To trigger error</button>
    </div>
  );
}
