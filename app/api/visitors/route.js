import { NextResponse } from 'next/server';
import { connectMongo } from '../../../lib/mongodb';
import Visitor from '../../../models/Visitor';

const clean = (value) => (typeof value === 'string' ? value.replace(/[<>]/g, '').trim().slice(0, 30) : '');

export async function POST(request) {
  try {
    const body = await request.json();
    const name = clean(body.name);
    const visitorId = clean(body.visitorId).replace(/[^a-zA-Z0-9-]/g, '').slice(0, 100);

    if (!name || !visitorId) {
      return NextResponse.json({ error: 'Name and visitor ID are required' }, { status: 400 });
    }

    await connectMongo();
    await Visitor.findOneAndUpdate(
      { visitorId },
      { $set: { name, visitedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to register visitor:', error);
    return NextResponse.json({ error: 'Could not save visitor' }, { status: 500 });
  }
}
