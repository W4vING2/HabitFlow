'use client'

import { User } from '@/entities/user/model'
import { Service } from '@/shared/api/apiService'
import { useGlobalStore } from '@/shared/store/globalStore'
import Button from '@/shared/ui/button'
import Input from '@/shared/ui/input'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'

export default function RegisterForm() {
	const { setIsAuthenticated, setCurrentUser } = useGlobalStore()
	const router = useRouter()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<User>()

	const onSubmit: SubmitHandler<User> = data => {
		Service.createUser(data)
		setIsAuthenticated(true)
		router.push('/')
		setCurrentUser(data)
	}

	return (
		<form
			className='w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-lg'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h2 className='text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center'>
				Регистрация
			</h2>

			<div className='space-y-5'>
				<div className='flex flex-col gap-2'>
					<Input
						label='Имя'
						type='text'
						name='username'
						placeholder='Введите имя'
						register={register('username', { required: 'Имя обязательно' })}
					/>
					{errors.username && (
						<span className='text-red-500 text-xs ml-1'>
							{errors.username.message}
						</span>
					)}
				</div>

				<div className='flex flex-col gap-2'>
					<Input
						label='Email'
						type='email'
						name='email'
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
						label='Пароль'
						type='password'
						name='password'
						placeholder='Введите пароль'
						register={register('password', {
							required: 'Пароль обязателен',
							minLength: { value: 6, message: 'Минимум 6 символов' },
						})}
					/>
					{errors.password && (
						<span className='text-red-500 text-xs ml-1'>
							{errors.password.message}
						</span>
					)}
				</div>

				<div className='pt-2'>
					<Button title='Зарегистрироваться' variant='primary' />
				</div>
			</div>
		</form>
	)
}
