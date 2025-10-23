import { db } from "../db.js";

export default async function createTable(table: "users") {
  if (table === "users") {
    await db.schema
      .createTable(table)
      .ifNotExists()
      .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
      .addColumn("name", "text", (col) => col.notNull())
      .addColumn("surname", "text", (col) => col.notNull())
      .addColumn("mobile", "text", (col) => col.notNull().unique())
      .addColumn("role", "text", (col) => col.notNull())
      .addColumn("password", "text", (col) => col.notNull())
      .addColumn("created_at", "text", (col) =>
        col.defaultTo(new Date().toISOString())
      )
      .addColumn("update_at", "text", (col) =>
        col.defaultTo(new Date().toISOString())
      )
      .execute();
  }
}
