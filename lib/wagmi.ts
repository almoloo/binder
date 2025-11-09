import { cookieStorage, createStorage, http } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mantle, mantleSepoliaTestnet } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
	throw new Error('Project ID is not defined');
}

export const networks = [mantle, mantleSepoliaTestnet];

export const wagmiAdapter = new WagmiAdapter({
	storage: createStorage({
		storage: cookieStorage,
	}),
	ssr: true,
	projectId,
	networks,
});

export const config = wagmiAdapter.wagmiConfig;
