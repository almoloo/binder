export enum ABIStateMutability {
	PURE = 'pure',
	VIEW = 'view',
	NONPAYABLE = 'nonpayable',
	PAYABLE = 'payable',
}

export enum ABIType {
	FUNCTION = 'function',
	EVENT = 'event',
	CONSTRUCTOR = 'constructor',
	FALLBACK = 'fallback',
	RECEIVE = 'receive',
}

export enum ABIArgumentType {
	ADDRESS = 'address',
	BOOL = 'bool',
	STRING = 'string',
	BYTES = 'bytes',

	UINT8 = 'uint8',
	UINT16 = 'uint16',
	UINT32 = 'uint32',
	UINT64 = 'uint64',
	UINT128 = 'uint128',
	UINT256 = 'uint256',

	INT8 = 'int8',
	INT16 = 'int16',
	INT32 = 'int32',
	INT64 = 'int64',
	INT128 = 'int128',
	INT256 = 'int256',

	BYTES1 = 'bytes1',
	BYTES2 = 'bytes2',
	BYTES3 = 'bytes3',
	BYTES4 = 'bytes4',
	BYTES5 = 'bytes5',
	BYTES6 = 'bytes6',
	BYTES7 = 'bytes7',
	BYTES8 = 'bytes8',
	BYTES9 = 'bytes9',
	BYTES10 = 'bytes10',
	BYTES11 = 'bytes11',
	BYTES12 = 'bytes12',
	BYTES13 = 'bytes13',
	BYTES14 = 'bytes14',
	BYTES15 = 'bytes15',
	BYTES16 = 'bytes16',
	BYTES17 = 'bytes17',
	BYTES18 = 'bytes18',
	BYTES19 = 'bytes19',
	BYTES20 = 'bytes20',
	BYTES21 = 'bytes21',
	BYTES22 = 'bytes22',
	BYTES23 = 'bytes23',
	BYTES24 = 'bytes24',
	BYTES25 = 'bytes25',
	BYTES26 = 'bytes26',
	BYTES27 = 'bytes27',
	BYTES28 = 'bytes28',
	BYTES29 = 'bytes29',
	BYTES30 = 'bytes30',
	BYTES31 = 'bytes31',
	BYTES32 = 'bytes32',

	TUPLE = 'tuple',
	FUNCTION = 'function',
	ARRAY = 'array',

	UNKNOWN = 'unknown',
}

export interface ABIInput {
	name: string;
	type: ABIArgumentType;
	indexed?: boolean;
	internalType?: string;
}

export interface ABIOutput {
	name: string;
	type: ABIArgumentType;
	internalType?: string;
}

export interface ABIFunctionObject {
	name: string;
	inputs: ABIInput[];
	outputs: ABIOutput[];
	stateMutability: ABIStateMutability;
	type: ABIType;
}

export enum InputTypes {
	TEXT = 'text',
	NUMBER = 'number',
	ADDRESS = 'address',
	BYTES = 'bytes',
	CHECKBOX = 'checkbox',
}
