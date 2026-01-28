'use client'

import { User } from '@/entities/user/model'
import { Service } from '@/shared/api/apiService'
import { useGlobalStore } from '@/shared/store/globalStore'
import Button from '@/shared/ui/button'
import Input from '@/shared/ui/input'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export default function LoginForm() {
	const [errorMessage, setErrorMessage] = useState('')
	const router = useRouter()
	const { setIsAuthenticated } = useGlobalStore()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Omit<User, 'username'>>()

	const onSubmit: SubmitHandler<Omit<User, 'username'>> = async data => {
		setErrorMessage('')
		try {
			const user = await Service.login(data.email, data.password)
			if (!user) {
				setErrorMessage('Неверный email или пароль')
				return
			}
			console.log('Пользователь вошел:', user)
		} catch (err) {
			setErrorMessage('Ошибка при входе')
			console.error(err)
		}
		setIsAuthenticated(true)
		router.push('/')
	}

	return (
		<form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
			<div className='flex flex-col gap-1'>
				<Input
					name='email'
					label='Email'
					type='email'
					placeholder='you@example.com'
					register={register('email', {
						required: 'Email обязателен',
						pattern: {
							value: /^\S+@\S+$/i,
							message: 'Неверный формат email',
						},
					})}
				/>
				{errors.email && (
					<span className='text-red-500 text-sm ml-1'>
						{errors.email.message}
					</span>
				)}
			</div>

			<div className='flex flex-col gap-1'>
				<Input
					name='password'
					label='Пароль'
					type='password'
					placeholder='Введите пароль'
					register={register('password', { required: 'Пароль обязателен' })}
				/>
				{errors.password && (
					<span className='text-red-500 text-sm ml-1'>
						{errors.password.message}
					</span>
				)}
			</div>

			{errorMessage && (
				<div className='text-red-500 text-sm'>{errorMessage}</div>
			)}

			<div className='mt-4'>
				<Button title='Войти' />
			</div>
		</form>
	)
}
