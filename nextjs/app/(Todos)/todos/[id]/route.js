import Todos from "../../../../todos.json";
import { writeFile } from "node:fs/promises";

export async function GET(_, { params }) {
    const { id } = await params;

    const todo = Todos.find((todo) => id === todo.id.toString());

    if (!todo) {
        return Response.json({ error: "Todo Not Found" });
    }

    return Response.json(todo);
}

export async function PUT(request, { params }) {
    const { id } = await params;
    const { name, completed } = await request.json();

    const todoIndex = Todos.findIndex((item) => id === item.id);

    if (!todoIndex) {
        return Response.json({ error: `No Todo found with this if : ${id}` });
    }

    const editedTodo = {
        id,
        name,
        completed,
    };

    Todos[todoIndex] = editedTodo;

    console.log(Todos);

    await writeFile("todos.json", JSON.stringify(Todos, null, 2));

    return Response.json({
        message: "Todo Updated Successfully",
    });
}



export async function DELETE(_, { params }) {
    const { id } = await params

    const updatedTodos = Todos.filter(item => item.id !== id);

    if (updatedTodos) {
        return Response.json({ error: `No Todo found with this if : ${id}` });
    }
    await writeFile("todos.json", JSON.stringify(updatedTodos, null, 2));

    return Response.json({
        message: "Todo Deleted Successfully",
    });
}