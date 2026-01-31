import type { HabitTask } from '@/entities/task/model'
import type { GoalEntity } from '@/entities/dashboard/model'

class ApiService {
	private baseUrl = 'http://localhost:4000'

	async getUsers() {
		const res = await fetch(`${this.baseUrl}/users`)
		if (!res.ok) throw new Error('Ошибка получения пользователей')
		return res.json()
	}

	async getUserById(userId: number) {
		const res = await fetch(`${this.baseUrl}/users/${userId}`)
		if (!res.ok) throw new Error('Ошибка получения пользователя')
		return res.json()
	}

	async createUser(data: {
		username: string
		email: string
		password: string
	}) {
		const res = await fetch(`${this.baseUrl}/users`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})
		if (!res.ok) throw new Error('Ошибка создания пользователя')
		return res.json()
	}

	async updateUser(
		userId: number,
		data: Partial<{ username: string; email: string; password: string }>,
	) {
		const res = await fetch(`${this.baseUrl}/users/${userId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})
		if (!res.ok) throw new Error('Ошибка обновления пользователя')
		return res.json()
	}

	async deleteUser(userId: number) {
		const res = await fetch(`${this.baseUrl}/users/${userId}`, {
			method: 'DELETE',
		})
		if (!res.ok) throw new Error('Ошибка удаления пользователя')
		return res.json()
	}

	// Tasks / habits

	async getTasks(params?: { userId?: string; date?: string }) {
		const searchParams = new URLSearchParams()
		if (params?.userId) searchParams.append('userId', params.userId)
		if (params?.date) searchParams.append('date', params.date)

		const query = searchParams.toString()
		const url = `${this.baseUrl}/tasks${query ? `?${query}` : ''}`

		const res = await fetch(url)
		if (!res.ok) throw new Error('Ошибка получения задач')
		const data = (await res.json()) as HabitTask[]
		return data
	}

	async createTask(payload: Omit<HabitTask, 'id'>) {
		const res = await fetch(`${this.baseUrl}/tasks`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})
		if (!res.ok) throw new Error('Ошибка создания задачи')
		const data = (await res.json()) as HabitTask
		return data
	}

	async updateTask(id: number, payload: Partial<Omit<HabitTask, 'id'>>) {
		const res = await fetch(`${this.baseUrl}/tasks/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})
		if (!res.ok) throw new Error('Ошибка обновления задачи')
		const data = (await res.json()) as HabitTask
		return data
	}

	async deleteTask(id: number) {
		const res = await fetch(`${this.baseUrl}/tasks/${id}`, {
			method: 'DELETE',
		})
		if (!res.ok) throw new Error('Ошибка удаления задачи')
		return true
	}

	// Goals

	async getGoals(params?: { userId?: string }) {
		const searchParams = new URLSearchParams()
		if (params?.userId) searchParams.append('userId', params.userId)

		const query = searchParams.toString()
		const url = `${this.baseUrl}/goals${query ? `?${query}` : ''}`

		const res = await fetch(url)
		if (!res.ok) throw new Error('Ошибка получения целей')
		const data = (await res.json()) as GoalEntity[]
		return data
	}

	async createGoal(payload: Omit<GoalEntity, 'id'>) {
		const res = await fetch(`${this.baseUrl}/goals`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})
		if (!res.ok) throw new Error('Ошибка создания цели')
		const data = (await res.json()) as GoalEntity
		return data
	}

	async updateGoal(id: number, payload: Partial<Omit<GoalEntity, 'id'>>) {
		const res = await fetch(`${this.baseUrl}/goals/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})
		if (!res.ok) throw new Error('Ошибка обновления цели')
		const data = (await res.json()) as GoalEntity
		return data
	}

	async deleteGoal(id: number) {
		const res = await fetch(`${this.baseUrl}/goals/${id}`, {
			method: 'DELETE',
		})
		if (!res.ok) throw new Error('Ошибка удаления цели')
		return true
	}

	async login(email: string, password: string) {
		const res = await fetch(
			`${this.baseUrl}/users?email=${email}&password=${password}`,
		)
		if (!res.ok) throw new Error('Ошибка при входе')
		const users = await res.json()
		return users.length > 0 ? users[0] : null
	}
}

export const Service = new ApiService()
