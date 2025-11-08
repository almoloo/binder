import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected, coinbaseWallet, metaMask } from '@wagmi/connectors';

// Define Mantle chains
const mantle = {
	id: 5000,
	name: 'Mantle',
	nativeCurrency: {
		decimals: 18,
		name: 'Mantle',
		symbol: 'MNT',
	},
	rpcUrls: {
		default: { http: ['https://rpc.mantle.xyz'] },
	},
	blockExplorers: {
		default: {
			name: 'Mantle Explorer',
			url: 'https://explorer.mantle.xyz',
		},
	},
} as const;

const mantleSepolia = {
	id: 5003,
	name: 'Mantle Sepolia',
	nativeCurrency: {
		decimals: 18,
		name: 'Mantle',
		symbol: 'MNT',
	},
	rpcUrls: {
		default: { http: ['https://rpc.sepolia.mantle.xyz'] },
	},
	blockExplorers: {
		default: {
			name: 'Mantle Sepolia Explorer',
			url: 'https://explorer.sepolia.mantle.xyz',
		},
	},
	testnet: true,
} as const;

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

if (!projectId) {
	throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required');
}

export const config = createConfig({
	chains: [mantle, mantleSepolia, mainnet],
	connectors: [injected(), coinbaseWallet(), metaMask()],
	transports: {
		[mantle.id]: http(),
		[mantleSepolia.id]: http(),
		[mainnet.id]: http(),
	},
});
