'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-500';

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black text-blue-600 tracking-tighter">
                EnergyCalc ⚡
              </span>
            </Link>
          </div>
          {session && (
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className={isActive('/dashboard')}>
                Головна
              </Link>
              <Link href="/dashboard/meters" className={isActive('/dashboard/meters')}>
                Лічильники
              </Link>
              <Link href="/dashboard/readings" className={isActive('/dashboard/readings')}>
                Внести показники
              </Link>
              <Link href="/dashboard/analytics" className={isActive('/dashboard/analytics')}>
                Аналітика
              </Link>
            </div>
          )}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-sm font-medium text-gray-900 hidden sm:block">
                  {session.user?.name || 'Користувач'}
                </span>
                <Button 
                  variant="secondary" 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm"
                >
                  Вийти
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 font-medium hover:text-blue-600">
                  Увійти
                </Link>
                <Link href="/register">
                  <Button className="text-sm">Реєстрація</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}