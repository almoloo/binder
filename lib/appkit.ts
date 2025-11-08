import { createAppKit } from '@reown/appkit/react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const metadata = {
	name: 'Binder',
	description: 'SIWE Authentication with Better Auth',
	url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
	icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

const mantle = {
	id: 5000,
	caipNetworkId: 'eip155:5000',
	chainNamespace: 'eip155',
	name: 'Mantle',
	nativeCurrency: {
		decimals: 18,
		name: 'Mantle',
		symbol: 'MNT',
	},
	rpcUrls: {
		default: {
			http: ['https://rpc.mantle.xyz'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Mantle Explorer',
			url: 'https://mantlescan.xyz',
		},
	},
};

const mantleSepolia = {
	id: 5003,
	caipNetworkId: 'eip155:5003',
	chainNamespace: 'eip155',
	name: 'Mantle Sepolia',
	nativeCurrency: {
		decimals: 18,
		name: 'Mantle',
		symbol: 'MNT',
	},
	rpcUrls: {
		default: {
			http: ['https://rpc.sepolia.mantle.xyz'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Mantle Sepolia Explorer',
			url: 'https://sepolia.mantlescan.xyz',
		},
	},
	testnet: true,
};

// Create the modal
createAppKit({
	networks: [mantle, mantleSepolia],
	projectId,
	metadata,
	features: {
		analytics: true,
	},
});
