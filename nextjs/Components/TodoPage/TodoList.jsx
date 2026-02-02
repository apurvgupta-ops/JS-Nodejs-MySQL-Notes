// import styles from "../../app/todos/todo.module.css";

import { connectDB } from "@/lib/connectDb";
import { Todo } from "@/models/todoModel";
import TodoItems from "./TodoItems";

export default async function TodoList() {
  // !OLD WAY
  // let todos = [];
  // try {
  //   const baseUrl = `${process.env.BASE_URL}/api/todos`;
  //   const res = await fetch(baseUrl, { cache: "no-store" });
  //   const data = await res.json();
  //   todos = data.data || [];
  // } catch (error) {
  //   console.log(error);
  //   return (
  //     <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full mx-auto mt-8">
  //       Failed to load todos
  //     </div>
  //   );
  // }

  await connectDB();
  const todosData = await Todo.find().lean();

  // Convert MongoDB documents to plain objects for Client Components
  const todos = todosData.map((todo) => ({
    _id: todo._id.toString(),
    title: todo.title,
    completed: todo.completed,
  }));

  if (!todos.length)
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full mx-auto mt-8">
        No Todos Found
      </div>
    );
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Todos</h2>
      <TodoItems todos={todos} />
    </div>
  );
}
