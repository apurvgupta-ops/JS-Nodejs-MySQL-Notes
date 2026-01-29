"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AddTodo({ onAdd }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to add");
      setTitle("");
      router.refresh();
    } catch (error) {
      console.log("Failed To Add");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleAdd}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add Todo"
        disabled={loading}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Adding" : "Add"}
      </button>
    </form>
  );
}
