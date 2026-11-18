import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { connectMongo } from '../../../../lib/mongodb';
import Visitor from '../../../../models/Visitor';

function authorized(request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  const supplied = request.headers.get('x-admin-password') || '';
  const suppliedBuffer = Buffer.from(supplied);
  const passwordBuffer = Buffer.from(password);
  return suppliedBuffer.length === passwordBuffer.length &&
    crypto.timingSafeEqual(suppliedBuffer, passwordBuffer);
}

export async function GET(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectMongo();
    const visitors = await Visitor.find({})
      .sort({ visitedAt: -1 })
      .select('name visitorId createdAt visitedAt')
      .lean();

    return NextResponse.json({
      visitors: visitors.map((visitor) => ({
        id: visitor._id.toString(),
        name: visitor.name,
        createdAt: visitor.createdAt,
        visitedAt: visitor.visitedAt,
      })),
    });
  } catch (error) {
    console.error('Failed to load visitors:', error);
    return NextResponse.json({ error: 'Could not load visitors' }, { status: 500 });
  }
}
