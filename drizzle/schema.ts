import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const eventos = pgTable('eventos', {
  id: varchar('id').primaryKey(),
  text: varchar('text', { length: 50 }).notNull(),
  start: timestamp('inicio', { withTimezone: true, mode: 'string' }).notNull(),
  end: timestamp('fin', { withTimezone: true, mode: 'string' }).notNull(),
  backColor: varchar('backcolor', { length: 50 }),
  borderColor: varchar('bordercolor', { length: 50 })
});
