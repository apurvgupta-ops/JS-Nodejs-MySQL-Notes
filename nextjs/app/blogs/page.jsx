import Link from "next/link";

// dynamic metadata
export const metadata = {
  title: "Blogs",
};

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
        <Link href={`/blogs/3`}> Blog 3</Link>
        <Link href={"/blogs/3/comments"}>Comments</Link>
      </p>
    </div>
  );
};

export default blogs;
