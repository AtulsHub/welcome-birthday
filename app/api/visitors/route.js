import { NextResponse } from 'next/server';
import { connectMongo } from '../../../lib/mongodb';
import Visitor from '../../../models/Visitor';

const clean = (value) => (typeof value === 'string' ? value.replace(/[<>]/g, '').trim().slice(0, 30) : '');

export async function POST(request) {
  try {
    const body = await request.json();
    const name = clean(body.name);
    const visitorId = clean(body.visitorId).replace(/[^a-zA-Z0-9-]/g, '').slice(0, 100);
    const action = body.action || null;

    if (!name || !visitorId) {
      return NextResponse.json({ error: 'Name and visitor ID are required' }, { status: 400 });
    }
    if (action && !['gift-opened', 'cheer-sent'].includes(action)) {
      return NextResponse.json({ error: 'Unsupported visitor action' }, { status: 400 });
    }

    await connectMongo();
    const now = new Date();
    const set = { name, visitedAt: now };
    if (action === 'gift-opened') set.giftOpenedAt = now;
    if (action === 'cheer-sent') set.cheerSentAt = now;
    const update = {
      $set: set,
      $setOnInsert: { createdAt: now },
    };
    if (action === 'gift-opened') update.$inc = { giftOpenedCount: 1 };

    await Visitor.findOneAndUpdate(
      { visitorId },
      update,
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to register visitor:', error);
    return NextResponse.json({ error: 'Could not save visitor' }, { status: 500 });
  }
}
