'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/web3';
import { ReactNode, useState } from 'react';
import '../lib/appkit'; // Initialize AppKit

export function Web3Provider({ children }: { children: ReactNode }) {
	const [queryClientInstance] = useState(() => new QueryClient());

	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClientInstance}>
				{children}
			</QueryClientProvider>
		</WagmiProvider>
	);
}
