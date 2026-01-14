import Link from "next/link";
import React from "react";

const blog = async ({ params }) => {
  const { blogId: id } = await params;

  return <div>blog {id}</div>;
};

export default blog;
