import { UseFormRegisterReturn } from 'react-hook-form'

export interface IInputProps {
	name: string
	label: string
	type?: string
	placeholder?: string
	register?: UseFormRegisterReturn
}
