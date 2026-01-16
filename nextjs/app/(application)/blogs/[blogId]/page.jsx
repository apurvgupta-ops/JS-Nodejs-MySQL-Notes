import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

// static site generation
export async function generateStaticParams() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/");
  const data = await res.json();

  // always return a array of object
  return data.map(({ id }) => ({ blogId: `${id}` }));
}

export async function generateMetadata({ params }) {
  const { blogId: id } = await params;

  console.log({ id });
  return {
    title: `Blog ${id}`,
    description: `Read blog post ${id}`,
  };
}

const blog = async ({ params }) => {
  const { blogId: id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  return <div>blog {id}</div>;
};

export default blog;
