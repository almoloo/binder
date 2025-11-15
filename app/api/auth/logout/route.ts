import { NextResponse } from 'next/server';
import { clearSessionCookie, endSession, SESSION_COOKIE } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
	const store = await cookies();
	const sid = store.get(SESSION_COOKIE)?.value;
	if (sid) {
		await endSession(sid);
	}
	const resp = NextResponse.json({ ok: true });
	clearSessionCookie(resp);
	return resp;
}
