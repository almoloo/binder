'use client';

import { useAppKitAccount, useAppKitState } from '@reown/appkit/react';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { status } = useAppKitAccount();
	const { initialized } = useAppKitState();

	if (
		!initialized ||
		!status ||
		status === 'connecting' ||
		status === 'reconnecting'
	) {
		return (
			// TODO: Add a better loading state
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	if (initialized && status === 'disconnected') {
		return (
			// TODO: Add a better disconnected state
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<p>You need to connect your wallet.</p>
				</div>
			</div>
		);
	}

	if (initialized && status === 'connected') {
		return <>{children}</>;
	}
}
