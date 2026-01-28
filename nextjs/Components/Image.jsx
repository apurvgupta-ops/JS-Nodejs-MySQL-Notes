import Image from "next/image";
import React from "react";

export default function ImageComponent() {
  return (
    <Image
      src={
        "https://images.unsplash.com/photo-1769109004977-607431134e25?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
      width={200}
      height={200}
      alt="vercel image"
      unoptimized
    />
  );
}
