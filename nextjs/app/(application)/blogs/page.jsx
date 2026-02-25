import Button from "@/Components/Button";
import Likes from "@/Components/Likes";
import Views from "@/Components/Views";
import Link from "next/link";
import { Suspense } from "react";

// dynamic metadata
export const metadata = {
  title: "Blogs",
};

const blogs = () => {
  const randomNumber = Math.random();
  console.log(randomNumber);
  if (randomNumber > 0.5) {
    throw new Error("Error Occured");
  }

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
      <div>
        <Button title={"Click"} />
        <Suspense fallback={"Loading Views"}>
          <Views />
        </Suspense>
        <Suspense fallback={"Loading Likes"}>
          <Likes />
        </Suspense>
      </div>
    </div>
  );
};

export default blogs;
