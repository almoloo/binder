'use server';

import { Contract } from '@/types/contracts';
import type {
	ContractChainABIData,
	ContractChainCreationData,
} from '@/types/etherscan';
import { lowerAddress } from './utils';
import {
	ABIFunctionObject,
	ABIInput,
	ABIOutput,
	ABIStateMutability,
	ABIType,
	InputTypes,
} from '@/types/abi';
import { AbiStateMutability } from 'viem';

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

export async function getFunctionsFromABI(abi: unknown) {
	let abiJSON = abi;
	if (typeof abi === 'string') {
		abiJSON = JSON.parse(abi);
	}

	const parsedAbi = abiJSON as Array<{
		type: ABIType;
		name?: string;
		inputs?: Array<ABIInput>;
		outputs?: Array<ABIOutput>;
		stateMutability?: AbiStateMutability;
		anonymous?: boolean;
	}>;

	const functions = parsedAbi
		.filter((item) => item.type === 'function' && item.name)
		.map((func) => ({
			name: func.name!,
			inputs: func.inputs || [],
			outputs: func.outputs || [],
			stateMutability:
				func.stateMutability || ABIStateMutability.NONPAYABLE,
			type: func.type,
		}));

	return functions as Array<ABIFunctionObject>;
}

function getFunctionInputType(input: ABIInput): InputTypes {
	switch (true) {
		case input.type === 'address':
			return InputTypes.ADDRESS;
		case input.type.startsWith('uint') || input.type.startsWith('int'):
			return InputTypes.NUMBER;
		case input.type === 'bool':
			return InputTypes.CHECKBOX;
		case input.type.startsWith('bytes'):
		case input.type === 'string':
			return InputTypes.TEXT;
		default:
			return InputTypes.TEXT;
	}
}

export async function parseABIFunction(abiFunction: ABIFunctionObject) {
	const inputs = abiFunction.inputs.map((input) => ({
		name: input.name,
		type: input.type,
		inputType: getFunctionInputType(input),
	}));

	const outputs = abiFunction.outputs.map((output) => ({
		name: output.name,
		type: output.type,
		inputType: getFunctionInputType(output),
	}));

	return {
		name: abiFunction.name,
		inputs,
		outputs,
		stateMutability: abiFunction.stateMutability,
		type: abiFunction.type,
	};
}
