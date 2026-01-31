'use client'

import { navItems } from '@/shared/config/sideBar'
import { useGlobalStore } from '@/shared/store/globalStore'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SideBar({
	sidebarOpen,
	setSidebarOpen,
}: {
	sidebarOpen: boolean
	setSidebarOpen: (open: boolean) => void
}) {
	const { currentUser, theme } = useGlobalStore()
	const { email, username } = currentUser || {}
	const isDark = theme === 'dark'
	const pathname = usePathname()

	const asideBase =
		'fixed md:sticky md:top-0 top-0 left-0 w-70 h-screen backdrop-blur-xl p-6 z-50 transition-transform duration-300 shadow-xl md:shadow-none'
	const asideTheme = isDark
		? 'bg-slate-900/90 border-r border-slate-800 text-slate-100'
		: 'bg-white/80 border-r border-slate-200/60'
	const asideTransform = sidebarOpen
		? 'translate-x-0'
		: '-translate-x-full md:translate-x-0'

	return (
		<aside className={`${asideBase} ${asideTheme} ${asideTransform}`}>
			<div className='flex items-center justify-between mb-10'>
				<div className='flex items-center gap-2'>
					<div className='w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center'>
						<span className='text-white text-lg font-bold'>HF</span>
					</div>
					<span className='text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
						Habit Flow
					</span>
				</div>
				<button
					className='md:hidden text-slate-400 hover:text-slate-600'
					onClick={() => setSidebarOpen(false)}
				>
					✕
				</button>
			</div>

			<nav className='flex flex-col gap-2'>
				{navItems.map(item => {
					if (pathname === null) return
					const isActive =
						item.href === '/'
							? pathname === '/'
							: pathname.startsWith(item.href)

					const activeClasses =
						'bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
					const inactiveLight =
						'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
					const inactiveDark =
						'text-slate-300 hover:bg-slate-800 hover:text-indigo-300'

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
								isActive ? activeClasses : isDark ? inactiveDark : inactiveLight
							}`}
							onClick={() => setSidebarOpen(false)}
						>
							<span className='text-xl'>{item.icon}</span>
							<span>{item.label}</span>
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
