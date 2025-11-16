export function lowerAddress(address: `0x${string}` | string): `0x${string}` {
	return address.toLowerCase() as `0x${string}`;
}
