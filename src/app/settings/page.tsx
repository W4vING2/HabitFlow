'use client'

import Settings from '@/features/settings/Settings'
import Header from '@/widgets/header'
import SideBar from '@/widgets/sideBar'
import { useGlobalStore } from '@/shared/store/globalStore'
import { useState } from 'react'

export default function SettingsPage() {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const { theme } = useGlobalStore()
	const isDark = theme === 'dark'

	const rootClass = isDark
		? 'relative min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 min-w-screen'
		: 'relative min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 min-w-screen'

	return (
		<div className={rootClass}>
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			<div className='flex min-h-screen'>
				<SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

				<main className='flex-1 p-4 md:p-8 pb-20 md:pb-8'>
					<Header setSidebarOpen={setSidebarOpen} />
					<Settings />
				</main>
			</div>
		</div>
	)
}

