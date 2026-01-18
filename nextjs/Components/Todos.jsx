import React from "react";

export default async function Todos() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=5",
  );
  const data = await res.json();
  return (
    <div>
      {data.map(({ id, title, completed }) => (
        <div key={id}>{title}</div>
      ))}
    </div>
  );
}
