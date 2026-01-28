'use client'

import RegisterForm from '@/features/registerForm/RegisterForm'
import CustomLink from '@/shared/ui/customlink'
import Heading from '@/shared/ui/heading'
import Text from '@/shared/ui/text'

export default function Register() {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100 px-4 min-w-screen'>
			<div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>
				<Heading title='Регистрация' />
				<Text>Создайте новый аккаунт</Text>
				<RegisterForm />
				<Text>
					Уже есть аккаунт?
					<CustomLink href='/login' title='Войти' />
				</Text>
			</div>
		</div>
	)
}
