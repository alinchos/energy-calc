import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Reading from '@/models/Reading';
import Meter from '@/models/Meter';
import Tariff from '@/models/Tariff';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { meterId, date, valueDay, valueNight } = await req.json();

  await dbConnect();

  const meter = await Meter.findOne({ _id: meterId, userId: session.user.id });
  if (!meter) return NextResponse.json({ message: 'Лічильник не знайдено' }, { status: 404 });

  const lastReading = await Reading.findOne({ meterId }).sort({ date: -1 });

  let consumptionDay = 0;
  let consumptionNight = 0;

  if (lastReading) {
    if (valueDay < lastReading.valueDay) {
      return NextResponse.json({ message: 'Нові показники менші за попередні!' }, { status: 400 });
    }
    consumptionDay = valueDay - lastReading.valueDay;
    consumptionNight = (valueNight || 0) - (lastReading.valueNight || 0);
  } else {
    consumptionDay = 0;
    consumptionNight = 0;
  }

  const tariff = await Tariff.findById(meter.tariffId);
  if (!tariff) return NextResponse.json({ message: 'Тариф не знайдено' }, { status: 400 });

  const cost = (consumptionDay * tariff.dayRate) + (consumptionNight * tariff.nightRate);

  const newReading = await Reading.create({
    meterId,
    date: date || new Date(),
    valueDay,
    valueNight: valueNight || 0,
    consumptionDay,
    consumptionNight,
    totalCost: parseFloat(cost.toFixed(2)),
  });

  return NextResponse.json(newReading, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const meterId = searchParams.get('meterId');

  if (!meterId) return NextResponse.json({ message: 'Meter ID required' }, { status: 400 });

  await dbConnect();
  const readings = await Reading.find({ meterId }).sort({ date: -1 });

  return NextResponse.json(readings);
}