import ConnectButton from '@/components/layout/connect-button';
// import Link from 'next/link';
import BinderLogo from '@/components/layout/logo';

export default function Header() {
	return (
		<header className="flex items-center justify-between px-10 py-3 gap-5">
			<BinderLogo />
			<div>
				{/* <Link href="/dashboard">Dashboard</Link> */}
				<ConnectButton />
			</div>
		</header>
	);
}
