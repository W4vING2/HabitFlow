import { IInputProps } from './input.types'

export default function Input({
	name,
	label,
	type,
	placeholder,
	register,
}: IInputProps) {
	return (
		<>
			<label htmlFor={name} className='mb-1 font-medium text-gray-700'>
				{label}
			</label>
			<input
				type={type}
				id={name}
				placeholder={placeholder}
				className='px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all'
				{...register}
			/>
		</>
	)
}
