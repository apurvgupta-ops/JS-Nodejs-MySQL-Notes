import Link from "next/link";
import React from "react";

const blogs = () => {
  return (
    <div>
      blogs
      <p>
        <Link href={`/blogs/1`}> Blog 1</Link>
      </p>
      <p>
        <Link href={`/blogs/2`}> Blog 2</Link>
      </p>
      <p>
        <Link href={`/blogs/3`}> Blog 4</Link>
      </p>
    </div>
  );
};

export default blogs;
