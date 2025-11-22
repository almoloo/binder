'use client';

import { wagmiAdapter, projectId } from '@/lib/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit, type Metadata } from '@reown/appkit/react';
import { mantle, mantleSepoliaTestnet } from '@reown/appkit/networks';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';
import { ReactNode } from 'react';
import SiweAutoLogin from '@/components/layout/siwe-auto-login';
import { FluentProvider, webDarkTheme } from '@fluentui/react-components';

const queryClient = new QueryClient();

if (!projectId) {
	throw new Error('Project ID is not defined');
}

const metadata = {
	name: 'Binder',
	description: 'Manage all your smart contracts in one place',
	url: process.env.NEXT_PUBLIC_APP_URL,
	icons: ['https://avatars.githubusercontent.com/u/179229932'], // TODO: Update with real icon
} as Metadata;

createAppKit({
	adapters: [wagmiAdapter],
	networks: [mantle, mantleSepoliaTestnet],
	defaultNetwork: mantleSepoliaTestnet,
	projectId,
	metadata,
	features: {
		analytics: true,
	},
});

function ContextProvider({
	children,
	cookies,
}: {
	children: ReactNode;
	cookies: string | null;
}) {
	const initialState = cookieToInitialState(
		wagmiAdapter.wagmiConfig as Config,
		cookies
	);

	return (
		<FluentProvider theme={webDarkTheme}>
			<WagmiProvider
				config={wagmiAdapter.wagmiConfig as Config}
				initialState={initialState}
			>
				<QueryClientProvider client={queryClient}>
					<SiweAutoLogin />
					{children}
				</QueryClientProvider>
			</WagmiProvider>
		</FluentProvider>
	);
}

export default ContextProvider;
