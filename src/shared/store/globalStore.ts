import { create } from 'zustand'

interface GlobalStore {
	isAuthenticated: boolean
	setIsAuthenticated: (value: boolean) => void
}

export const useGlobalStore = create<GlobalStore>(set => ({
	isAuthenticated: false,
	setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
}))
