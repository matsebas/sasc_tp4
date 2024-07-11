import { eq } from 'drizzle-orm';

import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eventos } from 'drizzle/schema';

export const db = drizzle(sql);

// Tipos
export type SelectEvento = typeof eventos.$inferSelect;
export type NewEvento = typeof eventos.$inferInsert;
export type ModifiedEvento = typeof eventos.$inferInsert;

// Funciones
export async function getEventos(): Promise<SelectEvento[]> {
  return await db.select().from(eventos).orderBy(eventos.id).limit(1000);
}

export async function getEventoById(id: string) {
  const result = await db
    .select()
    .from(eventos)
    .where(eq(eventos.id, id))
    .execute();
  return result[0]; // Devuelve solo el primer evento encontrado
}

export async function addEvento(newEvento: NewEvento) {
  console.log('addEvento', newEvento);
  const evento = (await db.insert(eventos).values(newEvento).returning())[0];
  return evento.id;
}

export async function deleteEventoById(id: string) {
  console.log('deleteEventoById', id);
  await db.delete(eventos).where(eq(eventos.id, id));
}

export async function updateEvento(evento: ModifiedEvento) {
  console.log('updateEvento', evento);
  await db.update(eventos).set(evento).where(eq(eventos.id, evento.id));
}
