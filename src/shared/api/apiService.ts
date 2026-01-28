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
