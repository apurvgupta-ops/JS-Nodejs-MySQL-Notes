"use client";
import React, { useState, useTransition } from "react";
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

export const DeleteButton = ({ id, onDelete }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => onDelete(id));
  };

  return (
    <button
      onClick={handleDelete}
      aria-label="Delete todo"
      disabled={isPending}
      className="disabled:opacity-50"
    >
      <MdOutlineDelete />
    </button>
  );
};

export const EditCheckbox = ({ id, completed, onToggle }) => {
  const [isPending, startTransition] = useTransition();

  const handleEdit = () => {
    startTransition(() => onToggle(id));
  };

  return (
    <input
      type="checkbox"
      checked={completed}
      onChange={handleEdit}
      disabled={isPending}
      className="disabled:opacity-50"
    />
  );
};
