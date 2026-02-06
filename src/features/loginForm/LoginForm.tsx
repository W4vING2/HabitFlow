'use client'

import { Service } from '@/shared/api/apiService'
import { useGlobalStore } from '@/shared/store/globalStore'
import Button from '@/shared/ui/button'
import CustomLink from '@/shared/ui/customlink/CustomLink'
import Input from '@/shared/ui/input'
import Text from '@/shared/ui/text/Text'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type LoginFormValues = {
	email: string
	password: string
}

export default function LoginForm() {
	const [errorMessage, setErrorMessage] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const { setIsAuthenticated, setCurrentUser } = useGlobalStore()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		mode: 'onBlur',
	})

	const onSubmit: SubmitHandler<LoginFormValues> = async data => {
		setErrorMessage('')
		setLoading(true)
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
			const message =
				err instanceof Error &&
				err.message.toLowerCase().includes('failed to fetch')
					? 'Не удалось подключиться к серверу. Проверьте Supabase URL и ключ'
					: 'Ошибка при входе'
			setErrorMessage(message)
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<form
			className='h-full w-full mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-lg'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h2 className='text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center'>
				Вход
			</h2>

			<div className='space-y-5'>
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
					error={errors.email?.message}
				/>

				<Input
					name='password'
					label='Пароль'
					type='password'
					placeholder='Введите пароль'
					register={register('password', { required: 'Пароль обязателен' })}
					error={errors.password?.message}
					showPasswordToggle
				/>

				{errorMessage && (
					<div className='bg-red-50 border border-red-200 rounded-lg p-3'>
						<p className='text-red-600 text-sm text-center'>{errorMessage}</p>
					</div>
				)}

				<div className='pt-2 mb-6'>
					<Button
						title={loading ? 'Вход...' : 'Войти'}
						variant='primary'
						disabled={loading}
					/>
				</div>
			</div>
			<Text align='center'>
				Нет аккаунта? <CustomLink href='/register' title='Зарегистрироваться' />
			</Text>
		</form>
	)
}
