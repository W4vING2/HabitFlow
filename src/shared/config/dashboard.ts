import type { Goal, Stat } from '@/entities/dashboard/model'

export const stats: Stat[] = [
	{ label: 'Active Goals', value: 4 },
	{ label: 'Tasks Today', value: 7 },
	{ label: 'Completed', value: 23 },
	{ label: 'Streak', value: '12 🔥' },
]

export const goals: Goal[] = [
	{ id: 1, title: 'Become Middle Frontend', progress: 65 },
	{ id: 2, title: 'Build 3 Pet Projects', progress: 33 },
]
