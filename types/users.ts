export interface User {
	id: string;
	address: `0x${string}`;
	createdAt: Date;
	contracts?: UserContractPref[];
}

export interface UserContractPref {
	userAddress: `0x${string}`;
	contractId: string;
	legendId?: string | null;
	lastUsedAt: Date;
	createdAt: Date;
}
