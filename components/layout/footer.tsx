'use client';

import { Code16Filled } from '@fluentui/react-icons';
import Link from 'next/link';

export default function Footer() {
	return (
		<footer className="flex items-center justify-between px-10 py-3 gap-5">
			<p>
				<Code16Filled className="inline-block mr-2" />
				<small>
					Designed & Developed by{' '}
					<Link
						href="https://github.com/almoloo"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline"
					>
						@almoloo
					</Link>
				</small>
			</p>
			<div>
				<Link
					href="https://github.com/almoloo/binder"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:underline"
				>
					<small>GitHub</small>
				</Link>
			</div>
		</footer>
	);
}
