import TodosData from '../../../todos.json'
import { writeFile } from 'node:fs/promises'

export function GET() {
    console.log("Calling Get Route")
    // new way
    return Response.json(TodosData)

    //old way
    // return new Response(JSON.stringify(TodosData), {
    //     headers: {
    //         "Content-Type": "application/json"
    //     }
    // })
}


export async function POST(request) {
    const todo = await request.json()

    const newTodo = {
        id: crypto.randomUUID(),
        name: todo.name,
        completed: "false"
    }

    TodosData.push(newTodo)

    await writeFile("todos.json", JSON.stringify(TodosData, null, 2))
    return Response.json({
        message: "Todo Created",
        data: newTodo
    })
}