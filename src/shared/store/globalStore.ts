import { User } from '@/entities/user/model'
import { create } from 'zustand'

interface GlobalStore {
	isAuthenticated: boolean
	setIsAuthenticated: (value: boolean) => void
	currentUser: User | null
	setCurrentUser: (user: User | null) => void
}

export const useGlobalStore = create<GlobalStore>(set => ({
	isAuthenticated: false,
	setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
	currentUser: null,
	setCurrentUser: (user: User | null) => set({ currentUser: user }),
}))
