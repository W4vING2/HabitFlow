'use client'

import Dashboard from '@/pages/Dashboard'
import { useGlobalStore } from '@/shared/store/globalStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
	const { isAuthenticated, authReady } = useGlobalStore()
	const router = useRouter()

	useEffect(() => {
		if (authReady && !isAuthenticated) {
			router.push('/login')
		}
	}, [authReady, isAuthenticated, router])
	return <Dashboard />
}
