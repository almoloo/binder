'use client';

import { useMutation } from '@tanstack/react-query';
import { useAccount, useSignMessage, useChainId } from 'wagmi';

function buildEip4361Message(params: {
	domain: string;
	address: `0x${string}`;
	uri: string;
	chainId: number;
	nonce: string;
	statement?: string;
	issuedAt?: string;
}) {
	const issuedAt = params.issuedAt ?? new Date().toISOString();
	const statement = params.statement ?? 'Sign in to Binder';
	return `${params.domain} wants you to sign in with your Ethereum account:\n${params.address}\n\n${statement}\n\nURI: ${params.uri}\nVersion: 1\nChain ID: ${params.chainId}\nNonce: ${params.nonce}\nIssued At: ${issuedAt}`;
}

export function useSiweLogin() {
	const { address } = useAccount();
	const chainId = useChainId();
	const { signMessageAsync } = useSignMessage();

	return useMutation({
		mutationFn: async () => {
			if (!address) throw new Error('No wallet connected');

			const origin =
				typeof window !== 'undefined' ? window.location.origin : '';
			const domain =
				typeof window !== 'undefined'
					? window.location.host
					: 'localhost';

			const { nonce } = await fetch('/api/auth/nonce').then((r) =>
				r.json()
			);
			const message = buildEip4361Message({
				domain,
				address,
				uri: origin,
				chainId,
				nonce,
			});
			const signature = await signMessageAsync({ message });

			const res = await fetch('/api/auth/verify', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ message, signature, address }),
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || 'Verification failed');
			}
			return res.json();
		},
	});
}

export function useLogout() {
	return useMutation({
		mutationFn: async () => {
			await fetch('/api/auth/logout', { method: 'POST' });
		},
	});
}
