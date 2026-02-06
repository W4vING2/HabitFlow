'use client'

import { supabase } from '@/shared/api/supabaseClient'
import { useGlobalStore } from '@/shared/store/globalStore'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useEffect } from 'react'

const buildUser = (user: SupabaseUser) => {
	const usernameFromMeta =
		typeof user.user_metadata?.username === 'string'
			? user.user_metadata.username
			: null
	const email = user.email ?? ''
	return {
		id: user.id,
		email,
		username: usernameFromMeta || (email ? email.split('@')[0] : 'User'),
	}
}

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const { setCurrentUser, setIsAuthenticated, resetAuth, setAuthReady } =
		useGlobalStore()

	useEffect(() => {
		let mounted = true

		const syncSession = async () => {
			const { data, error } = await supabase.auth.getSession()
			if (!mounted) return
			if (error || !data.session?.user) {
				resetAuth()
				setAuthReady(true)
				return
			}
			setCurrentUser(buildUser(data.session.user))
			setIsAuthenticated(true)
			setAuthReady(true)
		}

		void syncSession()

		const { data: subscription } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				if (!session?.user) {
					resetAuth()
					setAuthReady(true)
					return
				}
				setCurrentUser(buildUser(session.user))
				setIsAuthenticated(true)
				setAuthReady(true)
			},
		)

		return () => {
			mounted = false
			subscription.subscription.unsubscribe()
		}
	}, [resetAuth, setAuthReady, setCurrentUser, setIsAuthenticated])

	return <>{children}</>
}
