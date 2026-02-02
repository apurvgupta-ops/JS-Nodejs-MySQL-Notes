"use server";

import { connectDB } from "@/lib/connectDb";
import { Todo } from "@/models/todoModel";
import { revalidatePath } from "next/cache";

export async function createTodoAction(_, formData) {
  await connectDB();
  const { title } = formData;
  await Todo.create({ title });
  //   revalidatePath("/todos");
  return { message: "Todo Created" };
}
