'use client';

import logo from '@/public/logo.svg';
import { useAppKitAccount } from '@reown/appkit/react';
import Image from 'next/image';
import Link from 'next/link';

export default function BinderLogo() {
	const { isConnected } = useAppKitAccount();
	return (
		<Link href={isConnected ? '/dashboard' : '/'}>
			<h1 className="text-2xl font-bold flex items-center gap-2">
				<Image
					src={logo}
					alt="Binder Logo"
					width={32}
					height={32}
				/>
				<span>binder</span>
			</h1>
		</Link>
	);
}
