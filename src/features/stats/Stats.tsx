import type { HabitTask } from '@/entities/task/model'
import type { GoalEntity } from '@/entities/dashboard/model'
import { stats as baseStats } from '@/shared/config/dashboard'
import { Service } from '@/shared/api/apiService'
import { useGlobalStore } from '@/shared/store/globalStore'
import { useEffect, useMemo, useState } from 'react'

export default function Stats() {
	const { currentUser } = useGlobalStore()
	const [tasks, setTasks] = useState<HabitTask[]>([])
	const [goals, setGoals] = useState<GoalEntity[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const load = async () => {
			if (!currentUser?.email) return

			try {
				setLoading(true)
				const [tasksResponse, goalsResponse] = await Promise.all([
					Service.getTasks({ userId: currentUser.email }),
					Service.getGoals({ userId: currentUser.email }),
				])
				setTasks(tasksResponse)
				setGoals(goalsResponse)
			} finally {
				setLoading(false)
			}
		}

		void load()
	}, [currentUser])

	const today = new Date().toISOString().slice(0, 10)
	const yesterdayDate = useMemo(() => {
		const d = new Date()
		d.setDate(d.getDate() - 1)
		return d.toISOString().slice(0, 10)
	}, [])

	const tasksToday = useMemo(
		() => tasks.filter(t => t.date === today).length,
		[tasks, today],
	)

	const tasksYesterday = useMemo(
		() => tasks.filter(t => t.date === yesterdayDate).length,
		[tasks, yesterdayDate],
	)

	const completedTotal = useMemo(
		() => tasks.filter(t => t.completed).length,
		[tasks],
	)

	const completedToday = useMemo(
		() => tasks.filter(t => t.completed && t.date === today).length,
		[tasks, today],
	)

	const completedYesterday = useMemo(
		() => tasks.filter(t => t.completed && t.date === yesterdayDate).length,
		[tasks, yesterdayDate],
	)

	const activeGoals = useMemo(
		() => goals.filter(goal => goal.progress < 100).length,
		[goals],
	)

	const completedDatesSet = useMemo(() => {
		const set = new Set<string>()
		tasks.forEach(task => {
			if (task.completed && task.date) {
				set.add(task.date)
			}
		})
		return set
	}, [tasks])

	const streak = useMemo(() => {
		let count = 0
		let cursor = new Date()

		// нормализуем время
		cursor.setHours(0, 0, 0, 0)

		while (true) {
			const dateStr = cursor.toISOString().slice(0, 10)
			if (!completedDatesSet.has(dateStr)) break
			count += 1
			cursor.setDate(cursor.getDate() - 1)
		}

		return count
	}, [completedDatesSet])

	const prevStreak = useMemo(() => {
		let count = 0
		const cursor = new Date()
		// начинаем считать с вчерашнего дня
		cursor.setDate(cursor.getDate() - 1)
		cursor.setHours(0, 0, 0, 0)

		while (true) {
			const dateStr = cursor.toISOString().slice(0, 10)
			if (!completedDatesSet.has(dateStr)) break
			count += 1
			cursor.setDate(cursor.getDate() - 1)
		}

		return count
	}, [completedDatesSet])

	const last7Days = useMemo(() => {
		const result: { label: string; count: number }[] = []
		const now = new Date()
		now.setHours(0, 0, 0, 0)

		for (let i = 6; i >= 0; i -= 1) {
			const date = new Date(now)
			date.setDate(now.getDate() - i)
			const dateStr = date.toISOString().slice(0, 10)
			const count = tasks.filter(
				t => t.completed && t.date === dateStr,
			).length

			result.push({
				label: new Intl.DateTimeFormat('en-US', {
					weekday: 'short',
				}).format(date),
				count,
			})
		}

		return result
	}, [tasks])

	const stats = useMemo(
		() =>
			baseStats.map(stat => {
				if (stat.label === 'Active Goals') {
					return { ...stat, value: activeGoals }
				}
				if (stat.label === 'Tasks Today') {
					return { ...stat, value: tasksToday }
				}
				if (stat.label === 'Completed') {
					return { ...stat, value: completedTotal }
				}
				if (stat.label === 'Streak') {
					return { ...stat, value: `${streak} 🔥` }
				}
				return stat
			}),
		[activeGoals, completedTotal, streak, tasksToday],
	)

	const percentChanges = useMemo(() => {
		const percentChange = (current: number, previous: number) => {
			if (previous === 0) {
				if (current === 0) return 0
				return 100
			}
			return Math.round(((current - previous) / previous) * 100)
		}

		return {
			'Active Goals': 0, // пока нет истории изменений целей, показываем 0%
			'Tasks Today': percentChange(tasksToday, tasksYesterday),
			Completed: percentChange(completedToday, completedYesterday),
			Streak: percentChange(streak, prevStreak),
		} as Record<string, number>
	}, [
		completedToday,
		completedYesterday,
		prevStreak,
		streak,
		tasksToday,
		tasksYesterday,
	])

	const formatDelta = (value: number) => {
		const sign = value > 0 ? '+' : value < 0 ? '' : ''
		return `${sign}${value}%`
	}

	return (
		<section className='mb-8 space-y-4'>
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5'>
				{stats.map(stat => (
					<div
						key={stat.label}
						className='bg-white/80 backdrop-blur-sm p-5 md:p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-1'
					>
						<span className='text-xs md:text-sm text-slate-500 font-medium'>
							{stat.label}
						</span>
						<h2 className='text-2xl md:text-3xl font-bold mt-2 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
							{stat.value}
						</h2>
						<div className='mt-2 flex items-center gap-1 text-xs text-green-600 font-medium'>
							<span>↗</span>
							<span>
								{loading
									? 'Loading...'
									: formatDelta(percentChanges[stat.label] ?? 0)}
							</span>
						</div>
					</div>
				))}
			</div>

			<div className='bg-white/80 backdrop-blur-sm p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-sm'>
				<div className='flex items-center justify-between mb-3'>
					<span className='text-xs md:text-sm text-slate-500 font-medium'>
						Last 7 days
					</span>
					<span className='text-xs text-slate-400'>
						Completed tasks per day
					</span>
				</div>
				<div className='flex items-end gap-2 md:gap-3'>
					{last7Days.map(day => {
						const height = day.count === 0 ? 4 : 12 + day.count * 8
						return (
							<div key={day.label} className='flex flex-col items-center gap-1'>
								<div
									className='w-6 md:w-7 rounded-full bg-linear-to-t from-indigo-500 to-purple-500'
									style={{ height }}
								/>
								<span className='text-[10px] md:text-xs text-slate-500'>
									{day.label}
								</span>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
