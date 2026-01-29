import AddTodo from "@/Components/TodoPage/AddTodo";
import TodoList from "@/Components/TodoPage/TodoList";
import { Suspense } from "react";

export default async function TodosPage() {
  return (
    <>
      <h1>Todos</h1>

      <AddTodo />
      <Suspense fallback={<div>Loading...</div>}>
        <TodoList />
      </Suspense>
    </>
  );
}
