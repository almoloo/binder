import { InputTypes } from '@/types/abi';

interface ContractInputProps {
	name: string;
	type: string;
	inputType: InputTypes;
}

export default function ContractInput({
	name,
	type,
	inputType,
}: ContractInputProps) {
	const renderInput = () => {
		switch (inputType) {
			case InputTypes.ADDRESS:
				return (
					<input
						type="text"
						name={name}
						placeholder="0x..."
					/>
				);
			case InputTypes.NUMBER:
				return (
					<input
						type="number"
						name={name}
						placeholder="Enter a number"
					/>
				);
			case InputTypes.CHECKBOX:
				return (
					<input
						type="checkbox"
						name={name}
					/>
				);
			case InputTypes.TEXT:
			default:
				return (
					<input
						type="text"
						name={name}
						placeholder={`Enter ${type}`}
					/>
				);
		}
	};
	return (
		<div>
			<label className="text-sm text-neutral-500">{name}</label>
			{renderInput()}
		</div>
	);
}
