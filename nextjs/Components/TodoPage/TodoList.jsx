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
    return <div>Failed to load todos</div>;
  }

  if (!todos.length) return <div>No Todos Found</div>;
  console.log(todos);
  return (
    <div>
      <ul>
        {todos.map(({ _id, title, completed }) => (
          <>
            <li key={_id}>
              {title}
              <EditCheckbox id={_id} completed={completed} />
              <DeleteButton id={_id} />
            </li>
          </>
        ))}
      </ul>
    </div>
  );
}
