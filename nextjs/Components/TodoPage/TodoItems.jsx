"use client";
import React, { useOptimistic, useTransition } from "react";
import { DeleteButton, EditCheckbox } from "../Button";
import { deleteTodoAction, updateTodoAction } from "@/app/actions/todosActions";

export default function TodoItems({ todos }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
    todos,
    (state, { action, todo }) => {
      switch (action) {
        case "delete":
          return state.filter((t) => t._id !== todo._id);
        case "toggle":
          return state.map((t) =>
            t._id === todo._id ? { ...t, completed: !t.completed } : t,
          );
        default:
          return state;
      }
    },
  );

  const handleDelete = (id) => {
    const todoToDelete = optimisticTodos.find((t) => t._id === id);
    updateOptimisticTodos({ action: "delete", todo: todoToDelete });
    startTransition(async () => {
      const result = await deleteTodoAction(id);
      if (!result.success) {
        alert(result.message);
      }
    });
  };

  const handleToggle = (id) => {
    const todoToToggle = optimisticTodos.find((t) => t._id === id);
    updateOptimisticTodos({ action: "toggle", todo: todoToToggle });
    startTransition(async () => {
      const result = await updateTodoAction(id, !todoToToggle.completed);
      if (!result.success) {
        alert(result.message);
      }
    });
  };

  return (
    <div>
      <ul className="space-y-4">
        {optimisticTodos.map(({ _id, title, completed }) => (
          <li
            key={_id}
            className={`flex items-center justify-between bg-gray-50 rounded-lg px-5 py-4 shadow-sm transition ${completed ? "opacity-60 line-through" : ""}`}
          >
            <span className="text-lg">{title}</span>
            <div className="flex gap-2">
              <EditCheckbox
                id={_id}
                completed={completed}
                onToggle={handleToggle}
              />
              <DeleteButton id={_id} onDelete={handleDelete} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
