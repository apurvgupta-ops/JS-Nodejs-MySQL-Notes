// import styles from "./todo.module.css";

import AddTodo from "@/Components/TodoPage/AddTodo";
import TodoList from "@/Components/TodoPage/TodoList";
import { Suspense } from "react";

export default async function TodosPage() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full mx-auto mt-12">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
        Todos
      </h1>
      <AddTodo />
      <Suspense fallback={<div>Loading...</div>}>
        <TodoList />
      </Suspense>
    </div>
  );
}
