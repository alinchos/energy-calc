import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Meter from '@/models/Meter';
import Reading from '@/models/Reading';

type Props = {
  params: Promise<{ id: string }>;
};

export async function DELETE(req: Request, props: Props) {
  const params = await props.params;
  
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const deletedMeter = await Meter.findOneAndDelete({
      _id: params.id,
      userId: session.user.id 
    });

    if (!deletedMeter) {
      return NextResponse.json({ message: 'Лічильник не знайдено' }, { status: 404 });
    }

    await Reading.deleteMany({ meterId: params.id });

    return NextResponse.json({ message: 'Лічильник видалено' }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Meter Error:", error);
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, props: Props) {
  const params = await props.params;

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, tariffId, type, isActive } = await req.json();

    await dbConnect();

    const updatedMeter = await Meter.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { name, tariffId, type, isActive },
      { new: true }
    ).populate('tariffId');

    if (!updatedMeter) {
      return NextResponse.json({ message: 'Лічильник не знайдено' }, { status: 404 });
    }

    return NextResponse.json(updatedMeter, { status: 200 });
  } catch (error: any) {
    console.error("PUT Meter Error:", error);
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}