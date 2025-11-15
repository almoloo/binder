import { NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import {
	buildSignInMessage,
	consumeNonce,
	setSessionCookie,
	startSession,
} from '@/lib/auth';

type VerifyBodyLegacy = {
	address: `0x${string}`;
	signature: `0x${string}`;
	nonce: string;
};

type VerifyBodySiwe = {
	message: string; // full EIP-4361 message
	signature: `0x${string}`;
	address?: `0x${string}`;
};

function parseAddressFromMessage(message: string): `0x${string}` | null {
	const lines = message.split(/\r?\n/);
	for (const line of lines) {
		const m = line.match(/0x[a-fA-F0-9]{40}/);
		if (m) return m[0] as `0x${string}`;
	}
	return null;
}

function parseNonceFromMessage(message: string): string | null {
	const m = message.match(/Nonce:\s*([A-Za-z0-9-_.]+)/i);
	return m ? m[1] : null;
}

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as VerifyBodyLegacy | VerifyBodySiwe;

		let address: `0x${string}` | undefined;
		let signature: `0x${string}` | undefined;
		let nonce: string | undefined;
		let message: string | undefined;

		if ('message' in body) {
			message = body.message;
			signature = body.signature;
			address =
				body.address ?? parseAddressFromMessage(message) ?? undefined;
			nonce = parseNonceFromMessage(message) ?? undefined;
		} else {
			address = body.address;
			signature = body.signature;
			nonce = body.nonce;
			message = nonce ? buildSignInMessage(nonce) : undefined;
		}

		if (!address || !signature || !nonce || !message) {
			return NextResponse.json(
				{ error: 'Missing fields' },
				{ status: 400 }
			);
		}

		const valid = await verifyMessage({ address, message, signature });
		if (!valid) {
			return NextResponse.json(
				{ error: 'Invalid signature' },
				{ status: 401 }
			);
		}

		const ok = await consumeNonce(nonce);
		if (!ok) {
			return NextResponse.json(
				{ error: 'Invalid or expired nonce' },
				{ status: 401 }
			);
		}

		const sessionId = await startSession(address);
		const resp = NextResponse.json({ ok: true, address });
		setSessionCookie(resp, sessionId);
		return resp;
	} catch (e) {
		console.error('Verify error', e);
		return NextResponse.json({ error: 'Bad request' }, { status: 400 });
	}
}
