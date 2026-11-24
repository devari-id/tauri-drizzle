import { faker } from "@faker-js/faker";
import { db } from ".";
import { todosTable } from "./schema";

export const insertTodo = async () => {
  const title = faker.person.jobTitle();
  try {
    const result = await db
      .insert(todosTable)
      .values({
        title,
      })
      .returning();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchTodos = async () => {
  const result = await db.query.todosTable.findMany();
  return result;
};
