import { ResponseStatus } from '@/types/global';

export interface submitNewLegendArgs {
	contractId: string;
	title: string;
	description?: string;
	inputs: {
		[key: string]: unknown;
	};
}

export interface SubmitNewLegendResult {
	success: ResponseStatus;
	legendId: string | null;
}
