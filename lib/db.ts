import { eq, ilike } from 'drizzle-orm';

import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eventos } from 'drizzle/schema';

export const db = drizzle(sql);

// Tipos
export type SelectEvento = typeof eventos.$inferSelect;
export type NewEvento = typeof eventos.$inferInsert;
export type ModifiedEvento = typeof eventos.$inferInsert;

// Funciones
export async function getEventos(
  search: string,
  offset: number
): Promise<{
  eventos: SelectEvento[];
  newOffset: number | null;
}> {
  // Siempre buscar en la tabla completa, no por página
  if (search) {
    return {
      eventos: await db
        .select()
        .from(eventos)
        .where(ilike(eventos.text, `%${search}%`))
        .orderBy(eventos.id)
        .limit(1000),
      newOffset: null
    };
  }

  if (offset === null) {
    return { eventos: [], newOffset: null };
  }

  const moreEventos = await db.select().from(eventos).limit(20).offset(offset);
  const newOffset = moreEventos.length >= 20 ? offset + 20 : null;
  return { eventos: moreEventos, newOffset };
}

export async function getEventoById(id: number) {
  const result = await db
    .select()
    .from(eventos)
    .where(eq(eventos.id, id))
    .execute();
  return result[0]; // Devuelve solo el primer evento encontrado
}

export async function addEvento(newEvento: NewEvento) {
  await db.insert(eventos).values(newEvento);
}

export async function deleteEventoById(id: number) {
  await db.delete(eventos).where(eq(eventos.id, id));
}

export async function updateEvento(id: number, evento: ModifiedEvento) {
  await db.update(eventos).set(evento).where(eq(eventos.id, id));
}
