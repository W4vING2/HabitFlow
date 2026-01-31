'use client'

import { User } from '@/entities/user/model'
import { Service } from '@/shared/api/apiService'
import { useGlobalStore } from '@/shared/store/globalStore'
import Button from '@/shared/ui/button'
import CustomLink from '@/shared/ui/customlink/CustomLink'
import Input from '@/shared/ui/input'
import Text from '@/shared/ui/text/Text'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type RegisterFormValues = User & { confirmPassword: string }

export default function RegisterForm() {
	const [errorMessage, setErrorMessage] = useState('')
	const [loading, setLoading] = useState(false)
	const { setIsAuthenticated, setCurrentUser } = useGlobalStore()
	const router = useRouter()
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<RegisterFormValues>({
		mode: 'onBlur',
	})

	const passwordValue = watch('password')

	const onSubmit: SubmitHandler<RegisterFormValues> = async data => {
		if (data.password !== data.confirmPassword) {
			setErrorMessage('Пароли не совпадают')
			return
		}

		setErrorMessage('')
		setLoading(true)
		try {
			const { confirmPassword, ...payload } = data
			const createdUser = await Service.createUser(payload)
			setCurrentUser(createdUser)
			setIsAuthenticated(true)
			router.push('/')
		} catch (error) {
			console.error(error)
			const message =
				error instanceof Error &&
				error.message.toLowerCase().includes('failed to fetch')
					? 'Не удалось подключиться к серверу. Убедитесь, что запущен backend: npm run json-server'
					: 'Ошибка при регистрации'
			setErrorMessage(message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<form
			className='w-full h-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-lg'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h2 className='text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center'>
				Регистрация
			</h2>

			<div className='space-y-5'>
				<Input
					label='Имя'
					type='text'
					name='username'
					placeholder='Введите имя'
					register={register('username', { required: 'Имя обязательно' })}
					error={errors.username?.message}
				/>

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
					error={errors.email?.message}
				/>

				<Input
					label='Пароль'
					type='password'
					name='password'
					placeholder='Введите пароль'
					register={register('password', {
						required: 'Пароль обязателен',
						minLength: { value: 6, message: 'Минимум 6 символов' },
					})}
					error={errors.password?.message}
					showPasswordToggle
				/>

				<Input
					label='Подтвердите пароль'
					type='password'
					name='confirmPassword'
					placeholder='Повторите пароль'
					register={register('confirmPassword', {
						required: 'Повторите пароль',
						validate: value => value === passwordValue || 'Пароли не совпадают',
					})}
					error={errors.confirmPassword?.message}
					showPasswordToggle
				/>

				{errorMessage && (
					<div className='bg-red-50 border border-red-200 rounded-lg p-3'>
						<p className='text-red-600 text-sm text-center'>{errorMessage}</p>
					</div>
				)}

				<div className='pt-2 mb-6'>
					<Button
						title={loading ? 'Регистрация...' : 'Зарегистрироваться'}
						variant='primary'
						disabled={loading}
					/>
				</div>
			</div>
			<Text align='center'>
				Уже есть аккаунт? <CustomLink href='/login' title='Войти' />
			</Text>
		</form>
	)
}
