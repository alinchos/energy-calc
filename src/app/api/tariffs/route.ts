import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tariff from '@/models/Tariff';

export async function GET() {
  await dbConnect();

  const tariffs = await Tariff.find({});

  if (tariffs.length === 0) {
    const defaults = [
      { name: 'Звичайний (4.32 грн)', dayRate: 4.32, nightRate: 4.32, description: 'Єдиний тариф' },
      { name: 'Двозонний (День 4.32 / Ніч 2.16)', dayRate: 4.32, nightRate: 2.16, description: 'Вигідний вночі' },
    ];
    const created = await Tariff.insertMany(defaults);
    return NextResponse.json(created);
  }

  return NextResponse.json(tariffs);
}