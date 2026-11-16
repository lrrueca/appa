import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

// ✅ Check environment variables & provide a fallback or clear error
if (!process.env.DB_URL) {
    throw new Error("DATABASE_URL is missing in your .env file");
}
export const db = drizzle({ connection: process.env.DB_URL });
