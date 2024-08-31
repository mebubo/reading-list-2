import { defineConfig } from 'drizzle-kit'
export default defineConfig({
 schema: "./db/schema.ts",
  driver: 'turso',
  dialect: 'sqlite',
  out: './db',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'sqlite://prisma/dev.db',
  },
  verbose: true,
  strict: false,
})