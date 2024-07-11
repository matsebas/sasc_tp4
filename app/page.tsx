import { getEventos } from '@/lib/db';
import Calendar from './Calendar';

export default async function IndexPage() {
  const eventos = await getEventos();

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 gap-4">
      <h1 className="font-semibold text-3xl mb-4">Calendario Académico</h1>
      <Calendar eventos={eventos} />
    </main>
  );
}
