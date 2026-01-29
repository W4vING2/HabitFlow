'use client'

import { useGlobalStore } from '@/shared/store/globalStore'

export default function Header({
	setSidebarOpen,
}: {
	setSidebarOpen: (open: boolean) => void
}) {
	const { currentUser } = useGlobalStore()
	return (
		<header className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
			<div className='flex items-center gap-3'>
				<button
					className='md:hidden w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm'
					onClick={() => setSidebarOpen(true)}
				>
					<svg
						className='w-5 h-5'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 6h16M4 12h16M4 18h16'
						/>
					</svg>
				</button>
				<div>
					<h1 className='text-3xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'>
						Dashboard
					</h1>
					<p className='text-sm text-slate-500 mt-1'>
						Welcome back, {currentUser?.username}! 👋
					</p>
				</div>
			</div>
		</header>
	)
}
