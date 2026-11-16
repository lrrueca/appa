import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulid";

export const todoTable = pgTable("todo", {
    id: varchar({ length: 26 })
        .primaryKey()
        .$defaultFn(() => ulid()),
    task: varchar({ length: 255 }).notNull(),
    remarks: text(),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { mode: "date" })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
    deleted_at: timestamp("deleted_at", { mode: "date" }),
});
