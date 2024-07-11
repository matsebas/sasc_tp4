import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://default:ZPWwDG1pNE9q@ep-lingering-salad-a4nos0g1-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require'
  },
  out: "./drizzle/migrations",
  verbose: true,
  strict: true
});
