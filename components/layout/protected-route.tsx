'use client';

import { useAppKitAccount, useAppKitState } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { useSiweLogin } from '@/hooks/useSiweLogin';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { status, address } = useAppKitAccount();
	const { initialized } = useAppKitState();
	const login = useSiweLogin();
	const [manualAttempted, setManualAttempted] = useState(false);

	// Fetch server session (enabled only once wallet is connected)
	const {
		data: me,
		isFetching: fetchingSession,
		refetch: refetchSession,
	} = useQuery<{ address?: string; error?: string }>({
		queryKey: ['me', address?.toLowerCase()],
		queryFn: async () => {
			const res = await fetch('/api/me', { cache: 'no-store' });
			return res.json();
		},
		enabled: initialized && status === 'connected' && !!address,
	});

	// If connected but no session yet, attempt auto-login (user might have cancelled earlier)
	useEffect(() => {
		if (!address) return;
		if (
			initialized &&
			status === 'connected' &&
			!fetchingSession &&
			!me?.address &&
			!login.isPending &&
			!manualAttempted
		) {
			// attempt silent login once
			login.mutate(undefined, {
				onSuccess: () => refetchSession(),
				onError: () => {
					/* swallow errors; user can click retry */
				},
			});
		}
	}, [
		initialized,
		status,
		address,
		fetchingSession,
		me?.address,
		login.isPending,
		manualAttempted,
		login,
		refetchSession,
	]);

	// Loading states: initializing wallet or fetching session
	if (!initialized || status === 'connecting' || status === 'reconnecting') {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<p>Initializing wallet...</p>
				</div>
			</div>
		);
	}

	if (status === 'disconnected') {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-3">
					<p>You need to connect your wallet.</p>
					<p className="text-sm text-neutral-500">
						Use the connect button to continue.
					</p>
				</div>
			</div>
		);
	}

	// Connected but session not established yet
	if (status === 'connected' && !me?.address) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4">
					<p className="font-medium">Authorizing...</p>
					{login.isPending && (
						<p className="text-sm text-neutral-500">
							Waiting for signature...
						</p>
					)}
					{!login.isPending && (
						<button
							onClick={() => {
								setManualAttempted(true);
								login.mutate(undefined, {
									onSuccess: () => refetchSession(),
								});
							}}
							className="px-4 py-2 rounded bg-neutral-800 text-white text-sm hover:bg-neutral-700"
						>
							Sign In
						</button>
					)}
					{manualAttempted && !login.isPending && !me?.address && (
						<p className="text-xs text-red-500">
							Signature declined or failed. Retry.
						</p>
					)}
				</div>
			</div>
		);
	}

	// Authorized
	return <>{children}</>;
}
