import type { Config } from "drizzle-kit";

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL is not set");
}
if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_AUTH_TOKEN is not set");
}
export default {
  dialect: "turso",
  schema: "./src/schema/*",
  out: "./migrations",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  breakpoints: true,
  verbose: true,
  strict: true,
  casing: "snake_case",
} satisfies Config;
