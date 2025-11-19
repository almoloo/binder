'use server';

import type {
	submitNewLegendArgs,
	SubmitNewLegendResult,
} from '@/types/actions';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { lowerAddress } from '@/lib/utils';
import { ResponseStatus } from '@/types/global';

export async function submitNewLegend(
	args: submitNewLegendArgs
): Promise<SubmitNewLegendResult> {
	try {
		const session = await requireAuth();

		if (!session) {
			throw new Error('Unauthorized');
		}

		const database = db.getDb();

		const newLegend = {
			contractId: args.contractId,
			title: args.title,
			description: args.description || '',
			inputs: args.inputs,
			createdBy: lowerAddress(session.address),
			createdAt: new Date(),
		};

		const result = await database
			.collection('legends')
			.insertOne(newLegend);

		return {
			success: ResponseStatus.Success,
			legendId: result.insertedId.toString(),
		};
	} catch (error) {
		console.error('🚩 Error in submitNewLegend action:', error);
		return {
			success: ResponseStatus.Error,
			legendId: null,
		};
	}
}
