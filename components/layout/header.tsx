import ConnectButton from '@/components/layout/connect-button';
import Link from 'next/link';

export default function Header() {
	return (
		<div>
			<ConnectButton />
			<Link href="/dashboard">Dashboard</Link>
		</div>
	);
}
