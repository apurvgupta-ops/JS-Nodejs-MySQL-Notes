import { connectDB } from "@/lib/connectDb";
import { Todo } from "@/models/todoModel";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const todos = await Todo.find();

  return NextResponse.json({
    message: "Get All Todos",
    data: todos,
  });
}

export async function POST(request) {
  await connectDB();

  const todoBody = await request.json();
  console.log(todoBody);
  await Todo.create(todoBody);
  return NextResponse.json({
    message: "Todo Created",
    data: todoBody,
  });
}
