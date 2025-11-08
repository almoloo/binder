'use client';

import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

interface Session {
	user: {
		address: string;
	};
}

export function AuthButton() {
	const { open } = useAppKit();
	const { address, isConnected } = useAccount();
	const [session, setSession] = useState<Session | null>(null);
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		checkSession();
	}, []);

	const checkSession = async () => {
		try {
			const response = await fetch('/api/auth/get-session');
			if (response.ok) {
				const data = await response.json();
				setSession(data.session);
			} else {
				setSession(null);
			}
		} catch {
			setSession(null);
		}
	};

	const handleAuth = async () => {
		setIsPending(true);
		try {
			if (session) {
				// Sign out
				await fetch('/api/auth/sign-out', { method: 'POST' });
				setSession(null);
			} else if (isConnected && address) {
				// Sign in with SIWE
				const response = await fetch('/api/auth/sign-in/siwe', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						address,
						chainId: 5000, // Default to Mantle mainnet
					}),
				});

				if (response.ok) {
					await checkSession(); // Refresh session
				}
			} else {
				// Open wallet connection modal
				open();
			}
		} catch (error) {
			console.error('Auth error:', error);
		} finally {
			setIsPending(false);
		}
	};

	const getButtonText = () => {
		if (isPending) return 'Loading...';
		if (session) return 'Sign Out';
		if (isConnected) return 'Sign In';
		return 'Connect Wallet';
	};

	return (
		<button
			onClick={handleAuth}
			disabled={isPending}
			className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
		>
			{getButtonText()}
		</button>
	);
}
