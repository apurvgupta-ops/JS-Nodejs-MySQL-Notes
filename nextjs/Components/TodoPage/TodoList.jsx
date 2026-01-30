// import styles from "../../app/todos/todo.module.css";

import { DeleteButton, EditCheckbox } from "../Button";

export default async function TodoList() {
  let todos = [];
  try {
    const baseUrl = `${process.env.BASE_URL}/api/todos`;
    const res = await fetch(baseUrl, { cache: "no-store" });
    const data = await res.json();
    todos = data.data || [];
  } catch (error) {
    console.log(error);
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full mx-auto mt-8">
        Failed to load todos
      </div>
    );
  }
  if (!todos.length)
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full mx-auto mt-8">
        No Todos Found
      </div>
    );
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Todos</h2>
      <ul className="space-y-4">
        {todos.map(({ _id, title, completed }) => (
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
