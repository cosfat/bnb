import { NextResponse } from 'next/server';

export async function GET(req) {
  return NextResponse.json({ message: 'Debug endpoint is working!' });
} 