import type { Contract } from '@/types/contracts';
import Link from 'next/link';

interface ContractListItemProps {
	contract: Contract;
}

export default function ContractListItem({ contract }: ContractListItemProps) {
	return (
		<div>
			<div>address: {contract.address}</div>
			{contract.legends && contract.legends.length > 0 && (
				<div>
					Legend ID: {contract.legends[0].id} - Name:{' '}
					{contract.legends[0].title}
				</div>
			)}
			<Link href={`/dashboard/contract/${contract.id}`}>
				View Contract
			</Link>
		</div>
	);
}
