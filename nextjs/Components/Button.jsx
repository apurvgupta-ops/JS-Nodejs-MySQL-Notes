"use client";
import React, { useState } from "react";
export default function Button({ title }) {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    setCounter((prev) => prev + 1);
  };
  return (
    <button onClick={handleClick}>
      {title} : {counter}
    </button>
  );
}
