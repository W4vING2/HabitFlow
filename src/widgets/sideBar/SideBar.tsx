'use client'

import { navItems } from '@/shared/config/sideBar'
import { useGlobalStore } from '@/shared/store/globalStore'

export default function SideBar({
	sidebarOpen,
	setSidebarOpen,
}: {
	sidebarOpen: boolean
	setSidebarOpen: (open: boolean) => void
}) {
	const { currentUser } = useGlobalStore()
	const { email, username } = currentUser || {}
	return (
		<aside
			className={`fixed md:sticky md:top-0 top-0 left-0 w-70 h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200/60 p-6 z-50 transition-transform duration-300 shadow-xl md:shadow-none ${
				sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
			}`}
		>
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
				{navItems.map(item => (
					<a
						key={item.href}
						href={item.href}
						className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
							item.href === '/'
								? 'bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
								: 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
						}`}
						onClick={() => setSidebarOpen(false)}
					>
						<span className='text-xl'>{item.icon}</span>
						<span>{item.label}</span>
					</a>
				))}
			</nav>

			<div className='absolute bottom-6 left-6 right-6'>
				<div className='flex items-center gap-3 p-3 bg-slate-100 rounded-xl'>
					<div className='w-10 h-10 bg-linear-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold'>
						{username && username[0]?.toUpperCase()}
					</div>
					<div className='flex-1'>
						<div className='font-semibold text-sm'>{username}</div>
						<div className='text-xs text-slate-500'>{email}</div>
					</div>
				</div>
			</div>
		</aside>
	)
}
