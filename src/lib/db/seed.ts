import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { todoTable } from "./schema.js";

const db = drizzle(process.env.DB_URL!);

const sampleTasks = [
    "Review pull requests",
    "Update PostgreSQL schema",
    "Write unit tests for API",
    "Refactor authentication middleware",
    "Deploy staging build",
    "Fix soft-delete query filter",
    "Document environment variables",
];

async function main() {
    // Optional: clear existing rows
    await db.delete(todoTable);

    const rows = Array.from({ length: 20 }, (_, i) => ({
        task: `${sampleTasks[i % sampleTasks.length]} #${i + 1}`,
        remarks: i % 3 === 0 ? null : `Sample remark for task ${i + 1}`,
    }));

    await db.insert(todoTable).values(rows);
    console.log("Seeded 20 todo items successfully.");
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
