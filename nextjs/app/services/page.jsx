import Link from "next/link";
import React from "react";

function Services() {
  return (
    <div>
      Services
      <Link href={"/"}>Home</Link>
      <div>
        Our services
        <p>
          <Link href={"/services/web-dev"}>Web dev</Link>
        </p>
        <p>
          <Link href={"/services/app-dev"}>App dev</Link>
        </p>
        <p>
          <Link href={"/services/design"}>Design </Link>
        </p>
        <p>
          <Link href={"/services/seo"}> Seo</Link>
        </p>
      </div>
    </div>
  );
}

export default Services;
