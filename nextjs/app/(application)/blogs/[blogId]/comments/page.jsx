import React from "react";

async function comments({ params }) {
  let { blogId } = await params;
  return <div>comments of {blogId}</div>;
}

export default comments;
