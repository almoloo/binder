export default async function Page({
	params,
}: {
	params: Promise<{ contractId: string }>;
}) {
	const { contractId } = await params;
	return <div>{contractId}</div>;
}
