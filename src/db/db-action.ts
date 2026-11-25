import { faker } from "@faker-js/faker";
import { db } from "./init";
import { todosTable } from "./schema";
import { eq } from "drizzle-orm";

export const insertTodo = async () => {
  const title = faker.lorem.words(4);
  try {
    const result = await db().insert(todosTable).values({ title }).returning();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchTodos = async () => {
  const result = await db().query.todosTable.findMany();
  return result;
};

export const removeTodo = async (id: number) => {
  return db().delete(todosTable).where(eq(todosTable.id, id));
};
