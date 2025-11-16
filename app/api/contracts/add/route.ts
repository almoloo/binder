import { requireAuth } from '@/lib/auth';
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { WithId } from 'mongodb';
import type { Contract } from '@/types/contracts';
import { UserContractPref } from '@/types/users';
import { lowerAddress } from '@/lib/utils';
import { getContractDataFromChain } from '@/lib/server-utils';

interface AddContractRequestBody {
	chainId: number;
	address: `0x${string}`;
}

export async function POST(request: NextRequest) {
	try {
		const session = await requireAuth();
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const body: AddContractRequestBody = await request.json();
		const database = db.getDb();

		// CHECK IF CONTRACT EXISTS IN DB
		let contractId: string | null = null;
		let contract: Contract | null = null;
		const existingContract = await database
			.collection('contracts')
			.findOne<WithId<Contract>>({
				chainId: body.chainId,
				address: lowerAddress(body.address),
			});

		if (existingContract) {
			contractId = existingContract._id.toString();
			contract = existingContract;
			contract.id = contractId;
		} else {
			// GET CONTRACT DATA FROM CHAIN
			const retreivedData = await getContractDataFromChain(
				body.chainId,
				body.address
			);
			// ADD CONTRACT TO DB
			contract = {
				chainId: retreivedData.chainId,
				address: lowerAddress(retreivedData.address),
				deployer: lowerAddress(retreivedData.deployer),
				deployedAt: retreivedData.deployedAt,
				abi: JSON.parse(retreivedData.abi!),
			};
			const insertedContract = await database
				.collection('contracts')
				.insertOne(contract as Omit<Contract, 'id'>);
			contractId = insertedContract.insertedId.toString();
			contract.id = contractId;
		}

		const noIdContract: Contract = {
			id: contractId,
			chainId: contract.chainId,
			address: contract.address,
			deployer: contract.deployer,
			deployedAt: contract.deployedAt,
			abi: contract.abi,
		};

		// CHECK IF USER HAS ADDED THIS CONTRACT
		const userContractPref = await database
			.collection('user_contracts')
			.findOne<UserContractPref>({
				userAddress: lowerAddress(session.address),
				contractId: contractId!,
			});

		const hasUserContract = !!userContractPref;
		if (!hasUserContract) {
			// ADD USER CONTRACT PREF
			await database.collection('user_contracts').insertOne({
				userAddress: lowerAddress(session.address),
				contractId: contractId!,
				lastUsedAt: new Date(),
				createdAt: new Date(),
			} as Omit<UserContractPref, 'id'>);

			return NextResponse.json({
				message: 'Contract added successfully',
				contract: noIdContract,
			});
		} else {
			return NextResponse.json({
				message: 'Contract already exists in your list',
				// contract: contract,
				contract: noIdContract,
			});
		}
	} catch (error) {
		console.error('Error in /api/contracts/add:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
