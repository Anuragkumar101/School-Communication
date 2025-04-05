import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Check for environment variables
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create postgres connection
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(client, { schema });

console.log("Database connection established");