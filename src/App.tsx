import { useCallback, useEffect, useState } from "react";
import {
  insertTodo,
  fetchTodos as fetchTodosFromDb,
  removeTodo,
} from "./db/db-action";
import { Todo } from "./db/schema";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    const data = await fetchTodosFromDb();
    setTodos(data);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setIsLoading(true);
        await fetchTodos();
      } catch (err) {
        if (!active) return;
        console.error("Failed to load todos:", err);
        setError("Gagal memuat data todo.");
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [fetchTodos]);

  async function handleInsertTodo() {
    try {
      const result = await insertTodo();
      setTodos((prev) => [...prev, ...result]);
    } catch (err) {
      console.error("Failed to insert todo:", err);
      setError("Gagal menambah todo.");
    }
  }

  async function handleRemoveTodo(id: number) {
    try {
      await removeTodo(id);
      setTodos((t) => t.filter((v) => v.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  if (isLoading) {
    return <div>Memuat data...</div>;
  }

  if (error) {
    return <div role="alert">{error}</div>;
  }

  return (
    <main>
      <h1>Todos</h1>
      <button type="button" onClick={handleInsertTodo}>
        Insert new todo
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => handleRemoveTodo(todo.id)}>remove</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
