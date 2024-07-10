import { date, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const eventos = pgTable('eventos', {
  id: serial('id').primaryKey(),
  text: varchar('text', { length: 50 }).notNull(),
  start: date('start').notNull(),
  end: date('end').notNull(),
  backColor: varchar('backColor', { length: 50 }),
  borderColor: varchar('borderColor', { length: 50 })
});
