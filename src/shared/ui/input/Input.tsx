import { IInputProps } from './input.types'
import { useState } from 'react'

export default function Input({
	name,
	label,
	type = 'text',
	placeholder,
	register,
	error,
	showPasswordToggle = false,
}: IInputProps) {
	const [showPassword, setShowPassword] = useState(false)

	const isPassword = type === 'password'
	const inputType = isPassword && showPassword ? 'text' : type

	const baseClasses =
		'px-4 py-3 rounded-lg border bg-white/80 focus:outline-none focus:ring-2 transition-all w-full text-sm text-gray-900'
	const normalBorder = 'border-gray-300 focus:ring-indigo-500'
	const errorBorder = 'border-red-400 focus:ring-red-500'

	return (
		<div className='flex flex-col gap-1'>
			<label htmlFor={name} className='text-sm font-medium text-gray-700'>
				{label}
			</label>
			<div className='relative'>
				<input
					type={inputType}
					id={name}
					placeholder={placeholder}
					className={`${baseClasses} ${error ? errorBorder : normalBorder}`}
					{...register}
				/>
				{isPassword && showPasswordToggle && (
					<button
						type='button'
						onClick={() => setShowPassword(prev => !prev)}
						className='absolute inset-y-0 right-3 flex items-center text-xs text-slate-500 hover:text-slate-700'
					>
						{showPassword ? 'Скрыть' : 'Показать'}
					</button>
				)}
			</div>
			{error && (
				<span className='text-xs text-red-500 ml-1 mt-0.5'>{error}</span>
			)}
		</div>
	)
}
