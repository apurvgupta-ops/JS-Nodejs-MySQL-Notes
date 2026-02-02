"use server";

import { connectDB } from "@/lib/connectDb";
import { Todo } from "@/models/todoModel";
import { revalidatePath } from "next/cache";

export async function createTodoAction(_, formData) {
  try {
    await connectDB();
    const { title } = formData;
    await Todo.create({ title });
    revalidatePath("/todos");
    return { message: "Todo Created", success: true };
  } catch (error) {
    return { message: "Failed to create todo", success: false };
  }
}

export async function deleteTodoAction(id) {
  try {
    await connectDB();
    await Todo.findByIdAndDelete(id);
    revalidatePath("/todos");
    return { message: "Todo Deleted", success: true };
  } catch (error) {
    return { message: "Failed to delete todo", success: false };
  }
}

export async function updateTodoAction(id, completed) {
  try {
    await connectDB();
    await Todo.findByIdAndUpdate(id, { completed });
    revalidatePath("/todos");
    return { message: "Todo Updated", success: true };
  } catch (error) {
    return { message: "Failed to update todo", success: false };
  }
}
