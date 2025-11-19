import ContractListItem from '@/components/dashboard/contract-list-item';
import { getUserContracts } from '@/lib/data';

export default async function DashboardPage() {
	const contracts = await getUserContracts();

	return (
		<div>
			DashboardPage
			<div>
				{contracts.data?.map((contract) => (
					<ContractListItem
						contract={contract}
						key={contract.id}
					/>
				))}
			</div>
		</div>
	);
}
