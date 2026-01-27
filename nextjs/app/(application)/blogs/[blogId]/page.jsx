import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

// If we do this false, then if we visit any page which is not generated then is shows 404 not found.
// By default it is true,
export const dynamicParams = false;

// Incremental Site Regeneration(ISR) (Only works if do SSG)
export const revalidate = 5; // in seconds

// static site generation
export async function generateStaticParams() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/");
  const data = await res.json();

  // always return a array of object
  return data.map(({ id }) => ({ blogId: `${id}` }));
}

export async function generateMetadata({ params }) {
  const { blogId: id } = await params;

  // Other way of ISR
  // const res = await fetch("https://jsonplaceholder.typicode.com/todos/1",{
  //     next :{
  //       revalidate : 5
  //     }
  //   });
  // const data = await res.json();

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

  // if (id % 2 === 0) {
  //   return  "BlogId should be odd number";
  // }

  const randomNumber = Math.random();
  console.log(randomNumber);
  if (randomNumber > 0.5) {
    throw new Error("Error Occured in blogId page");
  }

  return <div>blog {id}</div>;
};

export default blog;
