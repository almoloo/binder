import type { ResponseStatus } from '@/types/global';
import type { Contract, ContractLegend } from '@/types/contracts';

export interface GetUserContractsResult {
	status: ResponseStatus;
	data: Array<Contract> | null;
}

export interface GetContractByIdArgs {
	contractId: string;
	legendId?: string;
}

export interface GetContractByIdResult {
	status: ResponseStatus;
	data: {
		contract: Contract;
		legend?: ContractLegend | null;
	} | null;
}
