import React from "react";

export default async function Likes() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <div> 300k Likes</div>;
}
