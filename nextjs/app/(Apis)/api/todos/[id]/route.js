import { connectDB } from "@/lib/connectDb";
import { Todo } from "@/models/todoModel";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  await connectDB();
  const { id } = await params;

  const todo = await Todo.findById(id);

  if (!todo) {
    return NextResponse.json(
      {
        message: "Todo Not Found",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    message: "Get Todo Successfully",
    data: todo,
  });
}

export async function PUT(request, { params }) {
  await connectDB();
  const { id } = await params;
  const { title, completed } = await request.json();

  const todo = await Todo.findByIdAndUpdate(
    id,
    { title, completed },
    { new: true },
  );

  if (!todo) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Todo Updated Successfully",
    data: todo,
  });
}

export async function DELETE(_, { params }) {
  await connectDB();
  const { id } = await params;

  const deleted = await Todo.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Todo Deleted Successfully",
  });
}
