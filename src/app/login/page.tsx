'use client'

import LoginForm from '@/features/loginForm/LoginForm'
import CustomLink from '@/shared/ui/customlink'
import Heading from '@/shared/ui/heading'
import Text from '@/shared/ui/text'

export default function Login() {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100 px-4 min-w-screen'>
			<div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>
				<Heading title='Вход в аккаунт' />
				<Text>Введите свои учетные данные для входа</Text>
				<LoginForm />
				<Text>
					Нет аккаунта?
					<CustomLink href='/register' title='Зарегистрироваться' />
				</Text>
			</div>
		</div>
	)
}
