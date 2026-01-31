'use client'

import RegisterForm from '@/features/registerForm/RegisterForm'
import { useGlobalStore } from '@/shared/store/globalStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Register() {
	const { isAuthenticated } = useGlobalStore()
	const router = useRouter()

	useEffect(() => {
		if (isAuthenticated) {
			router.push('/')
		}
	}, [isAuthenticated, router])

	return (
		<div className='flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 px-4 min-w-screen relative overflow-hidden'>
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.3),transparent_55%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.25),transparent_55%)] opacity-60' />
			<div className='relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30'>
				<RegisterForm />
			</div>
		</div>
	)
}
