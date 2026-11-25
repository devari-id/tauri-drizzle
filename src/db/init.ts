import { resolve } from "@tauri-apps/api/path";
import { Database, migrate } from "tauri-plugin-libsql-api";
import { createDb } from ".";

const migrations = import.meta.glob<string>("../../drizzle/*.sql", {
  eager: true,
  query: "?raw",
  import: "default",
});

const DB_URL = "sqlite:cekcek.db";

export type DrizzleDb = ReturnType<typeof createDb>;

let dbInstance: DrizzleDb | null = null;
let initPromise: Promise<DrizzleDb> | null = null;

/**
 * Dipanggil SEKALI saat startup aplikasi (di main.tsx).
 */
export async function initDb(): Promise<DrizzleDb> {
  if (dbInstance) {
    return dbInstance;
  }

  if (!initPromise) {
    initPromise = (async () => {
      try {
        await resolve(DB_URL);
        await Database.load({ path: DB_URL });
        await migrate(DB_URL, migrations);

        dbInstance = createDb(DB_URL);
        return dbInstance;
      } catch (err) {
        initPromise = null;
        throw err;
      }
    })();
  }

  return initPromise;
}

/**
 * Dipakai sinkron di komponen/service mana saja setelah initDb() selesai.
 */
export function db(): DrizzleDb {
  if (!dbInstance) {
    throw new Error(
      "Database belum diinisialisasi. Pastikan initDb() dipanggil di main.tsx sebelum render.",
    );
  }
  return dbInstance;
}
