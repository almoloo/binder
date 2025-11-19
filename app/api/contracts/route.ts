// TODO: DELETE

import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { lowerAddress } from '@/lib/utils';
import { UserContractPref } from '@/types/users';
import { ObjectId } from 'mongodb';
import { Contract, ContractLegend } from '@/types/contracts';

export async function GET() {
	try {
		const session = await requireAuth();
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const database = db.getDb();

		const userContracts = await database
			.collection('user_contracts')
			.find<UserContractPref>(
				{ userAddress: lowerAddress(session.address) },
				{ projection: { _id: 0 } }
			)
			.map((contract) => {
				const { contractId, legendId } = contract;
				const retreivedContract = database
					.collection('contracts')
					.findOne<Contract>(
						{ _id: new ObjectId(contractId) },
						{ projection: { _id: 0 } }
					)
					.then((c) => {
						if (c) {
							c.id = contractId;
						}
						return c;
					});
				let retreivedLegend = null;
				if (legendId) {
					retreivedLegend = database
						.collection('legends')
						.findOne<ContractLegend>(
							{
								_id: new ObjectId(legendId),
								contractId: contractId,
							},
							{ projection: { _id: 0 } }
						)
						.then((l) => {
							if (l) {
								l.id = legendId;
							}
							return l;
						});
				}
				return Promise.all([retreivedContract, retreivedLegend]).then(
					([contract, legend]) => {
						return {
							...contract,
							contract: contract || undefined,
							legend: legend || undefined,
						};
					}
				);
			})
			.sort({ lastUsedAt: -1 })
			.toArray();

		return NextResponse.json({ contracts: userContracts }, { status: 200 });
	} catch (error) {
		console.error('🚩 Error in GET /api/contracts/user/[address]:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
