import Database from "@tauri-apps/plugin-sql";
import { faker } from "@faker-js/faker";

let dbInstance: Database | null = null;

export async function getDB(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }
  try {
    dbInstance = await Database.load("sqlite:kanjipalv2.db");
    return dbInstance;
  } catch (error) {
    console.error("Gagal memuat database:", error);
    throw error;
  }
}

export const insertTodo = async () => {
  const title = faker.person.jobTitle();
  try {
    const db = await getDB();
    const result = await db.execute("INSERT into todos (title) VALUES ($1)", [
      title,
    ]);
    console.log(result.lastInsertId);
    console.log(result.rowsAffected);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchTodos = async () => {
  const db = await getDB();
  const result = await db.select("SELECT * from todos");
  return result;
};
