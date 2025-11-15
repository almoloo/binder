import { NextResponse } from 'next/server';
import { createNonce } from '@/lib/auth';

export async function GET() {
	const nonce = await createNonce();
	return NextResponse.json({ nonce });
}
