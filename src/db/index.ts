import { drizzle } from "drizzle-orm/sqlite-proxy";
import Database from "@tauri-apps/plugin-sql";
import * as schema from "./schema";

export async function getDb() {
  return await Database.load("sqlite:kanjipalv2.db");
}

function returnsRows(sql: string): boolean {
  const normalized = sql.trim().toLowerCase();
  return normalized.startsWith("select") || /\breturning\b/i.test(sql);
}

export const db = drizzle<typeof schema>(
  async (sql, params, method) => {
    const sqlite = await getDb();

    try {
      if (returnsRows(sql)) {
        const rawRows = await sqlite.select<Record<string, any>[]>(sql, params);
        const rows = rawRows.map((row) => Object.values(row));

        // Untuk Drizzle sqlite-proxy:
        // - method "get" mengharapkan satu baris (atau [] jika kosong)
        // - method "all" / "values" mengharapkan array of rows
        const resultRows = method === "get" ? (rows[0] ?? []) : rows;
        return { rows: resultRows };
      } else {
        await sqlite.execute(sql, params);
        return { rows: [] };
      }
    } catch (e) {
      console.error("SQL Error:", e);
      return { rows: [] };
    } finally {
      await sqlite.close();
    }
  },
  { schema, logger: true },
);
