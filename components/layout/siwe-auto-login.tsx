'use client';

import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useSiweLogin } from '@/hooks/useSiweLogin';

export default function SiweAutoLogin() {
	const { address, isConnected } = useAccount();
	const { mutateAsync: login } = useSiweLogin();
	const triedRef = useRef<Record<string, boolean>>({});

	// Check if we already have a server session
	const { refetch } = useQuery<{ address?: string; error?: string }>({
		queryKey: ['me'],
		queryFn: async () => {
			const res = await fetch('/api/me', { cache: 'no-store' });
			return res.json();
		},
		enabled: false,
	});

	useEffect(() => {
		if (!isConnected || !address) return;

		const key = address.toLowerCase();
		if (triedRef.current[key]) return;

		(async () => {
			triedRef.current[key] = true;
			try {
				// If already authorized, skip
				const initial = await (
					await fetch('/api/me', { cache: 'no-store' })
				).json();
				if (initial && initial.address) return;
				await login();
				await refetch();
			} catch (err) {
				// User might cancel signing; it's okay. We'll try again on reconnect.
				console.warn('SIWE auto login skipped:', err);
			}
		})();
	}, [isConnected, address, login, refetch]);

	return null;
}
