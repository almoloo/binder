import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';
import { db as mongo } from '@/lib/db';

export type SessionDoc = {
	_id: string; // sessionId
	address: `0x${string}`;
	createdAt: Date;
	expiresAt: Date;
};

export type NonceDoc = {
	_id: string; // nonce
	createdAt: Date;
	expiresAt: Date;
};

export const SESSION_COOKIE = 'sid';
const SESSION_TTL_DAYS = 30;
const NONCE_TTL_MIN = 5;

function now() {
	return new Date();
}

function minutesFromNow(m: number) {
	const d = new Date();
	d.setMinutes(d.getMinutes() + m);
	return d;
}

function daysFromNow(dn: number) {
	const d = new Date();
	d.setDate(d.getDate() + dn);
	return d;
}

function makeId(bytes = 16) {
	return randomBytes(bytes).toString('hex');
}

export async function createNonce(): Promise<string> {
	await mongo.connect();
	await ensureIndexes();
	const nonce = makeId(16);
	const dbase = mongo.getDb();
	await dbase.collection<NonceDoc>('nonces').insertOne({
		_id: nonce,
		createdAt: now(),
		expiresAt: minutesFromNow(NONCE_TTL_MIN),
	});
	return nonce;
}

export async function consumeNonce(nonce: string): Promise<boolean> {
	await mongo.connect();
	const dbase = mongo.getDb();
	const res = await dbase
		.collection<NonceDoc>('nonces')
		.deleteOne({ _id: nonce, expiresAt: { $gt: now() } });
	return res.deletedCount === 1;
}

export async function startSession(address: `0x${string}`): Promise<string> {
	await mongo.connect();
	await ensureIndexes();
	const sessionId = makeId(24);
	const dbase = mongo.getDb();
	await dbase.collection<SessionDoc>('sessions').insertOne({
		_id: sessionId,
		address,
		createdAt: now(),
		expiresAt: daysFromNow(SESSION_TTL_DAYS),
	});
	return sessionId;
}

export async function endSession(sessionId: string): Promise<void> {
	await mongo.connect();
	const dbase = mongo.getDb();
	await dbase
		.collection<SessionDoc>('sessions')
		.deleteOne({ _id: sessionId });
}

export async function getSession(
	sessionId: string
): Promise<SessionDoc | null> {
	await mongo.connect();
	const dbase = mongo.getDb();
	return dbase
		.collection<SessionDoc>('sessions')
		.findOne({ _id: sessionId, expiresAt: { $gt: now() } });
}

export async function requireAuth(): Promise<SessionDoc | null> {
	const store = await cookies();
	const sid = store.get(SESSION_COOKIE)?.value;
	if (!sid) return null;
	return getSession(sid);
}

export function setSessionCookie(resp: NextResponse, sessionId: string) {
	const secure = process.env.NODE_ENV === 'production';
	resp.cookies.set(SESSION_COOKIE, sessionId, {
		httpOnly: true,
		sameSite: 'lax',
		secure,
		path: '/',
		maxAge: 60 * 60 * 24 * SESSION_TTL_DAYS,
	});
}

export function clearSessionCookie(resp: NextResponse) {
	const secure = process.env.NODE_ENV === 'production';
	resp.cookies.set(SESSION_COOKIE, '', {
		httpOnly: true,
		sameSite: 'lax',
		secure,
		path: '/',
		maxAge: 0,
	});
}

// The message format that the client must sign. Keep in sync with the client.
export function buildSignInMessage(nonce: string) {
	return `Sign in to Binder\n\nNonce: ${nonce}`;
}

async function ensureIndexes() {
	const dbase = mongo.getDb();
	// TTL index to auto-clean expired docs
	await dbase
		.collection<NonceDoc>('nonces')
		.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
	await dbase
		.collection<SessionDoc>('sessions')
		.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}
