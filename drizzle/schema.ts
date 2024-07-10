import { date, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const eventos = pgTable('eventos', {
  id: serial('id').primaryKey(),
  text: varchar('text', { length: 50 }).notNull(),
  start: date('inicio').notNull(),
  end: date('fin').notNull(),
  backColor: varchar('backcolor', { length: 50 }),
  borderColor: varchar('bordercolor', { length: 50 })
});
