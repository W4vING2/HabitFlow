import type { HabitTask, TaskPriority } from '@/entities/task/model'
import type { GoalEntity } from '@/entities/dashboard/model'
import type { User } from '@/entities/user/model'
import { supabase } from '@/shared/api/supabaseClient'

type TaskRow = {
	id: number
	title: string
	description: string | null
	date: string
	completed: boolean
	user_id: string
	priority: TaskPriority | null
}

type GoalRow = {
	id: number
	title: string
	progress: number
	user_id: string
}

const mapTask = (row: TaskRow): HabitTask => ({
	id: row.id,
	title: row.title,
	description: row.description ?? '',
	date: row.date,
	completed: row.completed,
	userId: row.user_id,
	priority: row.priority ?? undefined,
})

const mapGoal = (row: GoalRow): GoalEntity => ({
	id: row.id,
	title: row.title,
	progress: row.progress,
	userId: row.user_id,
})

const toTaskInsert = (payload: Omit<HabitTask, 'id'>) => ({
	title: payload.title,
	description: payload.description ?? null,
	date: payload.date,
	completed: payload.completed,
	user_id: payload.userId,
	priority: payload.priority ?? null,
})

const toTaskUpdate = (payload: Partial<Omit<HabitTask, 'id'>>) => {
	const update: Record<string, unknown> = {}
	if (payload.title !== undefined) update.title = payload.title
	if (payload.description !== undefined) {
		update.description = payload.description ?? null
	}
	if (payload.date !== undefined) update.date = payload.date
	if (payload.completed !== undefined) update.completed = payload.completed
	if (payload.userId !== undefined) update.user_id = payload.userId
	if (payload.priority !== undefined) update.priority = payload.priority ?? null
	return update
}

const toGoalInsert = (payload: Omit<GoalEntity, 'id'>) => ({
	title: payload.title,
	progress: payload.progress,
	user_id: payload.userId,
})

const toGoalUpdate = (payload: Partial<Omit<GoalEntity, 'id'>>) => {
	const update: Record<string, unknown> = {}
	if (payload.title !== undefined) update.title = payload.title
	if (payload.progress !== undefined) update.progress = payload.progress
	if (payload.userId !== undefined) update.user_id = payload.userId
	return update
}

class ApiService {
	async createUser(data: { username: string; email: string; password: string }) {
		const { data: authData, error } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
			options: {
				data: {
					username: data.username,
				},
			},
		})

		if (error) throw new Error(error.message)
		if (!authData.user) throw new Error('Пользователь не создан')

		const user: User = {
			id: authData.user.id,
			email: authData.user.email ?? data.email,
			username: data.username,
		}

		return {
			user,
			session: authData.session,
		}
	}

	async login(email: string, password: string) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		if (error) throw new Error(error.message)
		if (!data.user) return null

		const username =
			(typeof data.user.user_metadata?.username === 'string' &&
				data.user.user_metadata.username) ||
			email.split('@')[0]

		const user: User = {
			id: data.user.id,
			email: data.user.email ?? email,
			username,
		}

		return user
	}

	// Tasks / habits
	async getTasks(params?: { userId?: string; date?: string }) {
		let query = supabase.from('tasks').select('*')
		if (params?.userId) {
			query = query.eq('user_id', params.userId)
		}
		if (params?.date) {
			query = query.eq('date', params.date)
		}

		const { data, error } = await query.order('id', { ascending: false })
		if (error) throw new Error(error.message || 'Ошибка получения задач')
		return (data ?? []).map(mapTask)
	}

	async createTask(payload: Omit<HabitTask, 'id'>) {
		const { data, error } = await supabase
			.from('tasks')
			.insert(toTaskInsert(payload))
			.select('*')
			.single()
		if (error) throw new Error(error.message || 'Ошибка создания задачи')
		return mapTask(data as TaskRow)
	}

	async updateTask(id: number, payload: Partial<Omit<HabitTask, 'id'>>) {
		const { data, error } = await supabase
			.from('tasks')
			.update(toTaskUpdate(payload))
			.eq('id', id)
			.select('*')
			.single()
		if (error) throw new Error(error.message || 'Ошибка обновления задачи')
		return mapTask(data as TaskRow)
	}

	async deleteTask(id: number) {
		const { error } = await supabase.from('tasks').delete().eq('id', id)
		if (error) throw new Error(error.message || 'Ошибка удаления задачи')
		return true
	}

	// Goals
	async getGoals(params?: { userId?: string }) {
		let query = supabase.from('goals').select('*')
		if (params?.userId) {
			query = query.eq('user_id', params.userId)
		}

		const { data, error } = await query.order('id', { ascending: true })
		if (error) throw new Error(error.message || 'Ошибка получения целей')
		return (data ?? []).map(mapGoal)
	}

	async createGoal(payload: Omit<GoalEntity, 'id'>) {
		const { data, error } = await supabase
			.from('goals')
			.insert(toGoalInsert(payload))
			.select('*')
			.single()
		if (error) throw new Error(error.message || 'Ошибка создания цели')
		return mapGoal(data as GoalRow)
	}

	async updateGoal(id: number, payload: Partial<Omit<GoalEntity, 'id'>>) {
		const { data, error } = await supabase
			.from('goals')
			.update(toGoalUpdate(payload))
			.eq('id', id)
			.select('*')
			.single()
		if (error) throw new Error(error.message || 'Ошибка обновления цели')
		return mapGoal(data as GoalRow)
	}

	async deleteGoal(id: number) {
		const { error } = await supabase.from('goals').delete().eq('id', id)
		if (error) throw new Error(error.message || 'Ошибка удаления цели')
		return true
	}
}

export const Service = new ApiService()
