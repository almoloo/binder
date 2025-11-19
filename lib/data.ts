'use server';

import { db } from '@/lib/db';
import { lowerAddress } from '@/lib/utils';
import type { UserContractPref } from '@/types/users';
import type { Contract, ContractLegend } from '@/types/contracts';
import { requireAuth } from '@/lib/auth';
import { ResponseStatus } from '@/types/global';
import { ObjectId } from 'mongodb';
import type {
	GetContractByIdArgs,
	GetContractByIdResult,
	GetUserContractsResult,
} from '@/types/data';

export async function getUserContracts(): Promise<GetUserContractsResult> {
	try {
		const session = await requireAuth();

		if (!session) {
			throw new Error('Unauthorized');
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
							// contract: contract || undefined,
							legends: legend ? [legend] : [],
						};
					}
				);
			})
			.sort({ lastUsedAt: -1 })
			.toArray();

		return {
			status: ResponseStatus.Success,
			data: userContracts.filter(Boolean) as unknown as Contract[],
		};
	} catch (error) {
		console.error('🚩 Error fetching user contracts:', error);
		return {
			status: ResponseStatus.Error,
			data: null,
		};
	}
}

export async function getContractById(
	args: GetContractByIdArgs
): Promise<GetContractByIdResult> {
	try {
		const session = await requireAuth();

		if (!session) {
			throw new Error('Unauthorized');
		}

		const database = db.getDb();

		const contract = await database
			.collection('contracts')
			.findOne<Contract>(
				{ _id: new ObjectId(args.contractId) },
				{ projection: { _id: 0 } }
			)
			.then((contract) => {
				if (contract) {
					contract.id = args.contractId;
				}
				return contract;
			});

		if (!contract) {
			throw new Error('Contract not found');
		}

		const responseJson: {
			contract: Contract;
			legend?: ContractLegend | null;
		} = {
			contract: contract,
		};

		if (args.legendId) {
			const legend = await database
				.collection('legends')
				.findOne<ContractLegend>(
					{
						_id: new ObjectId(args.legendId),
						contractId: args.contractId,
					},
					{ projection: { _id: 0 } }
				)
				.then((legend) => {
					if (legend) {
						legend.id = args.legendId!;
					}
					return legend;
				});

			if (legend) {
				responseJson.legend = legend;
			}
		}

		return {
			status: ResponseStatus.Success,
			data: { ...responseJson },
		};
	} catch (error) {
		console.error('🚩 Error fetching contract by ID:', error);
		return {
			status: ResponseStatus.Error,
			data: null,
		};
	}
}
