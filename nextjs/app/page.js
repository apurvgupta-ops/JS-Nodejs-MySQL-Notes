import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      Technical Agency
      <Link href={"/about"}>About US</Link>
      <Link href={"/services"}>Services</Link>
      <Link href={"/blogs"}>Blogs</Link>
      <Link href={"/files"}>Files</Link>
    </div>
  );
}
