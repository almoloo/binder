export default async function ContractPage({
	params,
}: {
	params: Promise<{ contractId: string }>;
}) {
	const { contractId } = await params;
	return <div>{contractId}</div>;
}
