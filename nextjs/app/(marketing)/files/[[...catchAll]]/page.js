import React from "react";

export default async function CatchAll({ params }) {
  const { catchAll } = await params;

  console.log(catchAll);
  return <div>CatchAll : {catchAll?.join("/")}</div>;
}
