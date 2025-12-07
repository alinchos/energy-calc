'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardHome() {
  const { data: session } = useSession();

  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        З поверненням, {session?.user?.name}!
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Ваш кабінет готовий до роботи.
      </p>
      
      <div className="flex justify-center gap-4">
        <Link 
          href="/dashboard/readings" 
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Внести нові показники
        </Link>
        <Link 
          href="/dashboard/analytics" 
          className="bg-white text-gray-900 border border-gray-300 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
        >
          Переглянути статистику
        </Link>
      </div>
    </div>
  );
}