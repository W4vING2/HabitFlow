import { User } from '@/entities/user/model'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface GlobalStore {
	isAuthenticated: boolean
	setIsAuthenticated: (value: boolean) => void
	currentUser: User | null
	setCurrentUser: (user: User | null) => void
	resetAuth: () => void
	theme: Theme
	toggleTheme: () => void
}

export const useGlobalStore = create<GlobalStore>()(
	persist(
		set => ({
			isAuthenticated: false,
			setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
			currentUser: null,
			setCurrentUser: (user: User | null) => set({ currentUser: user }),
			resetAuth: () => set({ isAuthenticated: false, currentUser: null }),
			theme: 'light',
			toggleTheme: () =>
				set(state => ({
					theme: state.theme === 'light' ? 'dark' : 'light',
				})),
		}),
		{
			name: 'habitflow-global',
		},
	),
)
