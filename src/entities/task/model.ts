export type TaskPriority = 'high' | 'medium' | 'low'

export interface HabitTask {
	id: number
	title: string
	description?: string
	/**
	 * Дата задачи в формате ISO (например, 2026-01-30).
	 * Используется для расчёта прогресса за день и стриков.
	 */
	date: string
	completed: boolean
	userId: string
	priority?: TaskPriority
}

