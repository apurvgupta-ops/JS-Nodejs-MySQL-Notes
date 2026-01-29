"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";

export default function Button({ title }) {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    setCounter((prev) => prev + 1);
  };
  return (
    <button onClick={handleClick}>
      {title} : {counter}
    </button>
  );
}

export const DeleteButton = ({ id }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch (error) {
      alert("Failed to delete todo");
    }
  };

  return (
    <>
      <button onClick={handleDelete} aria-label="Delete todo">
        <MdOutlineDelete />
      </button>
    </>
  );
};
