"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// import styles from "../../app/todos/todo.module.css";

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
    <form
      onSubmit={handleAdd}
      className="flex gap-3 mb-8 w-full max-w-xl mx-auto"
    >
      <input
        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-base bg-gray-50 focus:outline-none focus:border-violet-500 transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo..."
        disabled={loading}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-linear-to-r from-violet-500 to-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition hover:from-violet-600 hover:to-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
