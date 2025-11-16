export interface ContractChainCreationData {
	status: string;
	message: string;
	result: Array<{
		contractAddress: `0x${string}`;
		contractCreator: `0x${string}`;
		txHash: `0x${string}`;
		blockNumber: string;
		timestamp: string;
		contractFactory: `0x${string}`;
		creationBytecode: string;
	}> | null;
}

export interface ContractChainABIData {
	status: string;
	message: string;
	result: string;
}
