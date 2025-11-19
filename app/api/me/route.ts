import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { lowerAddress } from '@/lib/utils';
import { User } from '@/types/users';

export async function GET() {
	const session = await requireAuth();
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const database = db.getDb();
	const user = await database
		.collection('users')
		.findOne<User>({ address: lowerAddress(session.address) });

	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 });
	}

	const userContracts = await database
		.collection('user_contracts')
		.find({ userAddress: lowerAddress(session.address) })
		.toArray();

	return NextResponse.json({
		address: session.address,
		user: {
			id: user.id,
			address: user.address,
			createdAt: user.createdAt,
			contracts: userContracts.map((uc) => ({
				userAddress: uc.userAddress,
				contractId: uc.contractId,
				legendId: uc.legendId,
				lastUsedAt: uc.lastUsedAt,
				createdAt: uc.createdAt,
			})),
		} as User,
	});
}
