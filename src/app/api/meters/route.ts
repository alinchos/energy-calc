import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Meter from '@/models/Meter';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const meters = await Meter.find({ userId: session.user.id }).populate('tariffId');

  return NextResponse.json(meters);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, tariffId, type } = await req.json();

  if (!name || !tariffId) {
    return NextResponse.json({ message: 'Неповні дані' }, { status: 400 });
  }

  await dbConnect();

  const newMeter = await Meter.create({
    userId: session.user.id,
    tariffId,
    name,
    type: type || 'single-zone',
  });

  return NextResponse.json(newMeter, { status: 201 });
}