"use client";
import { createTodoAction } from "@/app/actions/todosActions";
import { useActionState, useState } from "react";

// import styles from "../../app/todos/todo.module.css";

export default function AddTodo() {
  const [state, action, pending] = useActionState(createTodoAction, {});
  const [title, setTitle] = useState("");

  const handleAdd = async () => {
    if (!title.trim()) return;
    const data = {
      title,
    };
    await action(data);
    if (state.success !== false) {
      setTitle("");
      alert(state.message);
    }
  };

  return (
    <form
      action={handleAdd}
      // onSubmit={handleAdd}
      className="flex gap-3 mb-8 w-full max-w-xl mx-auto"
    >
      <input
        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-base bg-gray-50 focus:outline-none focus:border-violet-500 transition"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo..."
        disabled={pending}
        required
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-linear-to-r from-violet-500 to-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition hover:from-violet-600 hover:to-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {pending ? "Adding..." : "Add"}
      </button>
      {state.message}
    </form>
  );
}
