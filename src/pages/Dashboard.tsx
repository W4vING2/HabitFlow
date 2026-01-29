'use client'

import Stats from '@/features/stats/Stats'
import { useState } from 'react'
import Header from '../widgets/header'
import SideBar from '../widgets/sideBar'
import Tasks from '../widgets/tasks'

export default function DashboardPage() {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className='relative min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 min-w-screen'>
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
					<Stats />
					<Tasks />
				</main>
			</div>
		</div>
	)
}
