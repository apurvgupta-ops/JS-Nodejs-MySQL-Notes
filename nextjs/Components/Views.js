import React from "react";

export default async function Views() {
  await new Promise((resolve) => setTimeout(resolve, 6000));
  return <div>100k Views</div>;
}
