'use server';

import { Contract } from '@/types/contracts';
import type {
	ContractChainABIData,
	ContractChainCreationData,
} from '@/types/etherscan';
import { lowerAddress } from './utils';

export async function generateEtherscanEndpoint(
	params: Record<string, string>
) {
	const queryString = new URLSearchParams(params).toString();
	return `https://api.etherscan.io/v2/api?${queryString}&apikey=${process.env.ETHERSCAN_API_KEY}`;
}

export async function getContractDataFromChain(
	chainId: number,
	address: `0x${string}`
) {
	const creationEndpoint = await generateEtherscanEndpoint({
		module: 'contract',
		action: 'getcontractcreation',
		chainid: chainId.toString(),
		contractaddresses: address,
	});

	const abiEndpoint = await generateEtherscanEndpoint({
		module: 'contract',
		action: 'getabi',
		address: address,
		chainid: chainId.toString(),
	});

	const creationResponse = await fetch(creationEndpoint);
	if (!creationResponse.ok) {
		throw new Error('Failed to fetch contract data from chain');
	}

	const creationData =
		(await creationResponse.json()) as ContractChainCreationData;

	if (!creationData.result || creationData.result.length === 0) {
		throw new Error('No contract data found for the given address');
	}

	const abiResponse = await fetch(abiEndpoint);
	if (!abiResponse.ok) {
		throw new Error('Failed to fetch contract ABI from chain');
	}

	const abiData = (await abiResponse.json()) as ContractChainABIData;

	return {
		address: lowerAddress(address),
		chainId,
		deployer: creationData.result[0].contractCreator,
		deployedAt: new Date(
			parseInt(creationData.result[0].timestamp, 10) * 1000
		),
		abi: abiData.result,
	} as Contract;
}
