import Link from "next/link";
import React from "react";

export async function generateMetadata({ params }) {
  const { blogId: id } = await params;
  return {
    title: `Blog ${id}`,
    description: `Read blog post ${id}`,
  };
}

const blog = async ({ params }) => {
  const { blogId: id } = await params;

  return <div>blog {id}</div>;
};

export default blog;
