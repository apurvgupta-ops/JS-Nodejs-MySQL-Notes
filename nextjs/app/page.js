import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      hello world
      <Link href={"/about"}>About US</Link>
      <Link href={"/services"}>Services</Link>
      <Link href={"/blogs"}>Blogs</Link>
    </div>
  );
}
