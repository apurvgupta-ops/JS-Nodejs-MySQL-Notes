import React, { useOptimistic } from "react";

export default function TodoItems({ todos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    initialTodos,
    (state, newTodo) => [newTodo, ...state],
  );

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
              <EditCheckbox id={_id} completed={completed} />
              <DeleteButton id={_id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
