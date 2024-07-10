import './globals.css';

import { Logo } from '@/components/icons';
import {
  CalendarDaysIcon,
  LayoutListIcon,
  UsersIcon
} from 'lucide-react';
import Link from 'next/link';
import { NavItem } from './nav-item';
import { Providers } from './providers';

export const metadata = {
  title: 'TP4 Calendario - MSEBASTIAO',
  description:
    'Trabajo práctico 4 de Seminario de Actualización de Sistemas Colaborativos'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <div className="grid min-h-screen w-full sm:grid-cols-[220px_1fr]">
            <div className="hidden border-r bg-content1 sm:block">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-5">
                  <Link
                    className="flex items-center gap-2 font-semibold"
                    href="/"
                  >
                    <Logo />
                    <span className="">TP4 Calendario</span>
                  </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <nav className="grid items-start px-4 font-medium">
                    <NavItem href="/">
                      <CalendarDaysIcon className="h-4 w-4" />
                      Calendario
                    </NavItem>
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <header className="flex h-14 sm:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between sm:justify-end">
                <Link
                  className="flex items-center gap-2 font-semibold sm:hidden"
                  href="/"
                >
                  <Logo />
                  <span className="">TP4</span>
                </Link>
              </header>
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
