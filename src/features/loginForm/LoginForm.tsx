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
	const { setIsAuthenticated, setCurrentUser } = useGlobalStore()
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
			setCurrentUser(user)
			setIsAuthenticated(true)
			router.push('/')
		} catch (err) {
			setErrorMessage('Ошибка при входе')
			console.error(err)
		}
	}

	return (
		<form
			className='w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-lg'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h2 className='text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center'>
				Вход
			</h2>

			<div className='space-y-5'>
				<div className='flex flex-col gap-2'>
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
						<span className='text-red-500 text-xs ml-1'>
							{errors.email.message}
						</span>
					)}
				</div>

				<div className='flex flex-col gap-2'>
					<Input
						name='password'
						label='Пароль'
						type='password'
						placeholder='Введите пароль'
						register={register('password', { required: 'Пароль обязателен' })}
					/>
					{errors.password && (
						<span className='text-red-500 text-xs ml-1'>
							{errors.password.message}
						</span>
					)}
				</div>

				{errorMessage && (
					<div className='bg-red-50 border border-red-200 rounded-lg p-3'>
						<p className='text-red-600 text-sm text-center'>{errorMessage}</p>
					</div>
				)}

				<div className='pt-2'>
					<Button title='Войти' variant='primary' />
				</div>
			</div>
		</form>
	)
}
