'use client'

import { useGlobalStore } from '@/shared/store/globalStore'
import Button from '@/shared/ui/button'
import Heading from '@/shared/ui/heading'
import Text from '@/shared/ui/text'
import { useRouter } from 'next/navigation'

export default function Settings() {
	const { currentUser, resetAuth, theme, toggleTheme } = useGlobalStore()
	const router = useRouter()

	const handleLogout = () => {
		resetAuth()
		router.push('/login')
	}

	const themeLabel = theme === 'light' ? 'Светлая тема' : 'Тёмная тема'
	const themeToggleTitle =
		theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'

	return (
		<section className='space-y-6'>
			<div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200/60 shadow-sm'>
				<Heading title='Аккаунт' />
				<Text size='sm' className='mt-1'>
					Информация о вашем профиле и сеансе.
				</Text>

				<div className='mt-6 flex items-center gap-4'>
					<div className='w-12 h-12 bg-linear-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg'>
						{currentUser?.username?.[0]?.toUpperCase() ?? '?'}
					</div>
					<div className='flex-1'>
						<div className='font-semibold text-slate-800'>
							{currentUser?.username ?? 'Неизвестный пользователь'}
						</div>
						<div className='text-xs text-slate-500'>
							{currentUser?.email ?? 'email не указан'}
						</div>
					</div>
					<Button
						title='Выйти из аккаунта'
						variant='secondary'
						type='button'
						onClick={handleLogout}
					/>
				</div>
			</div>

			<div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200/60 shadow-sm'>
				<Heading title='Оформление' />
				<Text size='sm' className='mt-1'>
					Переключите тему интерфейса приложения.
				</Text>

				<div className='mt-6 flex flex-col md:flex-row md:items-center gap-4'>
					<div className='flex-1'>
						<div className='text-sm font-medium text-slate-700'>
							Текущая тема: {themeLabel}
						</div>
						<Text size='sm'>
							Тёмная тема делает фон дашборда и страниц более контрастным.
						</Text>
					</div>
					<Button
						title={themeToggleTitle}
						variant='primary'
						type='button'
						onClick={toggleTheme}
					/>
				</div>
			</div>
		</section>
	)
}

