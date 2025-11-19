import { requireAuth } from '@/lib/auth';
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ContractLegend, type Contract } from '@/types/contracts';
import { ObjectId } from 'mongodb';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await requireAuth();
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const legendId = searchParams.get('legendId');
		const { id } = await params;
		const database = db.getDb();

		const contract = await database
			.collection('contracts')
			.findOne<Contract>(
				{ _id: new ObjectId(id) },
				{ projection: { _id: 0 } }
			)
			.then((contract) => {
				if (contract) {
					contract.id = id;
				}
				return contract;
			});

		if (!contract) {
			return NextResponse.json(
				{ error: 'Contract not found' },
				{ status: 404 }
			);
		}

		const responseJson: {
			contract: Contract;
			legend?: ContractLegend | null;
		} = {
			contract: contract,
		};

		if (legendId) {
			const legend = await database
				.collection('legends')
				.findOne<ContractLegend>(
					{ _id: new ObjectId(legendId), contractId: id },
					{ projection: { _id: 0 } }
				)
				.then((legend) => {
					if (legend) {
						legend.id = legendId;
					}
					return legend;
				});

			if (legend) {
				responseJson.legend = legend;
			}
		}

		return NextResponse.json({ ...responseJson }, { status: 200 });
	} catch (error) {
		console.error('🚩 Error in GET /api/contracts/[id]:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
