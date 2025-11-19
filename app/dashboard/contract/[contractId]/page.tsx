import ContractInput from '@/components/contract/contract-input';
import { getContractById } from '@/lib/data';
import { getFunctionsFromABI, parseABIFunction } from '@/lib/server-utils';

export default async function ContractPage({
	params,
}: {
	params: Promise<{ contractId: string }>;
}) {
	const { contractId } = await params;

	const contract = await getContractById({ contractId });
	const functions = await getFunctionsFromABI(
		contract.data?.contract.abi || ''
	);

	const parsedFunctions = await Promise.all(
		functions.map((func) => parseABIFunction(func))
	);

	return (
		<div>
			{contractId}
			<div>address: {contract.data?.contract.address}</div>
			<div>
				{parsedFunctions.map((func) => (
					<div
						key={func.name}
						className="border border-blue-500"
					>
						<h3 className="font-bold">{func.name}</h3>
						{func.inputs.map((input) => (
							<ContractInput
								name={input.name}
								type={input.type}
								inputType={input.inputType}
								key={input.name}
							/>
						))}
					</div>
				))}
			</div>
			<pre className="text-xs">
				<code>{JSON.stringify(parsedFunctions, null, 2)}</code>
			</pre>
		</div>
	);
}
