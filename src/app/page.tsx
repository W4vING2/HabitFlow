'use client'

import { useGlobalStore } from '@/shared/store/globalStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
	const { isAuthenticated } = useGlobalStore()
	const router = useRouter()

	useEffect(() => {
		if (!isAuthenticated) {
			router.push('/login')
		} else {
			router.push('/')
		}
	}, [isAuthenticated, router])
	return <h1>Hello World</h1>
}
