'use server';

import { addEvento, deleteEventoById, NewEvento, updateEvento } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveEvento(evento: NewEvento) {
  const order = await addEvento(evento);
  revalidatePath('/');
  return order;
}

export async function deleteEvento(id: string) {
  await deleteEventoById(id);
  revalidatePath('/');
}

export async function editEvento(modified: NewEvento) {
  await updateEvento(modified);
  revalidatePath('/');
}
