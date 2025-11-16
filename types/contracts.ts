export interface Contract {
	id?: string;
	chainId: number;
	address: `0x${string}`;
	deployedAt: Date;
	deployer: `0x${string}`;
	abi?: string;
	legends?: ContractLegend[];
}

export interface ContractLegend {
	id: string;
	contractId: string;
	createdBy: `0x${string}`;
	createdAt: Date;
	title: string;
	description?: string;
	inputs: {
		[key: string]: unknown;
	};
}

export interface ContractUser {
	id: string;
	contractId: string;
	userAddress: `0x${string}`;
	lastUsedAt: Date;
	createdAt: Date;
}
