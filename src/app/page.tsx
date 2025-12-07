'use client';

import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Контролюйте витрати на електроенергію
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            EnergyCalc — це простий інструмент для обліку показників лічильників, 
            аналізу витрат та прогнозування бюджету. Підтримує двозонні тарифи.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/register">
              <Button className="px-8 py-3 text-lg">Почати безкоштовно</Button>
            </Link>
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
              Вже є акаунт <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}