import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { databaseEnv } from "../env";
import { singleton } from "../singleton";
import * as schema from "./schema";

const connection = () =>
  singleton("database", () => {
    // Supabase session pooler (port 5432); it speaks plain Postgres, so prepared statements work.
    const sql = postgres(databaseEnv().DATABASE_URL, { max: 5, ssl: "require" });
    return { sql, db: drizzle(sql, { schema, casing: "snake_case" }) };
  });

export const database = () => connection().db;

export async function closeDatabase(): Promise<void> {
  await connection().sql.end({ timeout: 5 });
}

export async function runMigrations(): Promise<void> {
  await migrate(database(), { migrationsFolder: "drizzle" });
}
