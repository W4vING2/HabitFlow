import Task from '@/entities/task/Task'
import type { HabitTask, TaskPriority } from '@/entities/task/model'
import type { GoalEntity } from '@/entities/dashboard/model'
import { Service } from '@/shared/api/apiService'
import Button from '@/shared/ui/button'
import Heading from '@/shared/ui/heading'
import Text from '@/shared/ui/text'
import { useGlobalStore } from '@/shared/store/globalStore'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type NewTaskPayload = {
	title: string
	priority: TaskPriority
}

export default function Tasks() {
	const { currentUser } = useGlobalStore()
	const router = useRouter()
	const pathname = usePathname()
	const [tasks, setTasks] = useState<HabitTask[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [newTask, setNewTask] = useState<NewTaskPayload>({
		title: '',
		priority: 'medium',
	})
	const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>(
		'all',
	)
	const [goals, setGoals] = useState<GoalEntity[]>([])
	const [goalsLoading, setGoalsLoading] = useState(false)
	const [goalsError, setGoalsError] = useState<string | null>(null)

	const showGoalsSummary = pathname === '/'

	useEffect(() => {
		const load = async () => {
			if (!currentUser?.id) {
				setTasks([])
				return
			}

			try {
				setLoading(true)
				setError(null)

				const today = new Date().toISOString().slice(0, 10)

				const data = await Service.getTasks({
					userId: currentUser.id,
					date: today,
				})

				setTasks(data)
			} catch (e) {
				console.error(e)
				setError('Не удалось загрузить задачи')
			} finally {
				setLoading(false)
			}
		}

		void load()
	}, [currentUser])

	// Загружаем цели только для дашборда
	useEffect(() => {
		const loadGoals = async () => {
			if (!showGoalsSummary) return
			if (!currentUser?.id) {
				setGoals([])
				return
			}

			try {
				setGoalsLoading(true)
				setGoalsError(null)
				const data = await Service.getGoals({ userId: currentUser.id })
				setGoals(data)
			} catch (e) {
				console.error(e)
				setGoalsError('Не удалось загрузить цели')
			} finally {
				setGoalsLoading(false)
			}
		}

		void loadGoals()
	}, [currentUser, showGoalsSummary])

	const handleCreateTask = async () => {
		if (!newTask.title.trim()) return
		if (!currentUser?.id) {
			setError('Войдите, чтобы добавлять задачи')
			return
		}

		try {
			setError(null)
			const today = new Date().toISOString().slice(0, 10)

			const payload: Omit<HabitTask, 'id'> = {
				title: newTask.title.trim(),
				description: '',
				date: today,
				completed: false,
				userId: currentUser.id,
				priority: newTask.priority,
			}

			const created = await Service.createTask(payload)
			setTasks(prev => [created, ...prev])
			setNewTask({ title: '', priority: 'medium' })
		} catch (e) {
			console.error(e)
			setError('Не удалось создать задачу')
		}
	}

	const handleToggleCompleted = async (task: HabitTask) => {
		const optimistic = tasks.map(t =>
			t.id === task.id ? { ...t, completed: !t.completed } : t,
		)
		setTasks(optimistic)

		try {
			await Service.updateTask(task.id, { completed: !task.completed })
		} catch (e) {
			console.error(e)
			setError('Не удалось обновить задачу')
			// откат
			setTasks(tasks)
		}
	}

	const handleDeleteTask = async (task: HabitTask) => {
		const prev = tasks
		setTasks(tasks.filter(t => t.id !== task.id))

		try {
			await Service.deleteTask(task.id)
		} catch (e) {
			console.error(e)
			setError('Не удалось удалить задачу')
			setTasks(prev)
		}
	}

	const completedToday = useMemo(
		() => tasks.filter(t => t.completed).length,
		[tasks],
	)

	const totalToday = tasks.length

	const filteredTasks = useMemo(() => {
		if (statusFilter === 'active') {
			return tasks.filter(t => !t.completed)
		}
		if (statusFilter === 'completed') {
			return tasks.filter(t => t.completed)
		}
		return tasks
	}, [statusFilter, tasks])

	return (
		<section
			className={`grid grid-cols-1 gap-6 ${
				showGoalsSummary ? 'lg:grid-cols-[2fr_1fr]' : ''
			}`}
		>
			<div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow'>
				<div className='flex items-center justify-between mb-4 md:mb-6'>
					<Heading title="Today's Tasks" />
				</div>

				<div className='mb-4 flex flex-col gap-3 md:flex-row md:items-center'>
					<input
						type='text'
						value={newTask.title}
						onChange={e =>
							setNewTask(prev => ({ ...prev, title: e.target.value }))
						}
						placeholder='Add a new task...'
						className='flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500 bg-slate-50/60 text-gray-900'
					/>
					<select
						value={newTask.priority}
						onChange={e =>
							setNewTask(prev => ({
								...prev,
								priority: e.target.value as TaskPriority,
							}))
						}
						className='rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500 text-gray-900'
					>
						<option value='high'>High</option>
						<option value='medium'>Medium</option>
						<option value='low'>Low</option>
					</select>
					<div className='md:w-auto w-full'>
						<Button
							title='+ Add Task'
							variant='primary'
							onClick={handleCreateTask}
						/>
					</div>
				</div>

				{error && (
					<div className='mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600'>
						{error}
					</div>
				)}

				<div className='mb-4 flex gap-2 text-xs'>
					<button
						type='button'
						onClick={() => setStatusFilter('all')}
						className={`rounded-full px-3 py-1 border ${
							statusFilter === 'all'
								? 'border-indigo-500 bg-indigo-50 text-indigo-700'
								: 'border-slate-200 text-slate-500 hover:border-slate-300'
						}`}
					>
						All
					</button>
					<button
						type='button'
						onClick={() => setStatusFilter('active')}
						className={`rounded-full px-3 py-1 border ${
							statusFilter === 'active'
								? 'border-indigo-500 bg-indigo-50 text-indigo-700'
								: 'border-slate-200 text-slate-500 hover:border-slate-300'
						}`}
					>
						Active
					</button>
					<button
						type='button'
						onClick={() => setStatusFilter('completed')}
						className={`rounded-full px-3 py-1 border ${
							statusFilter === 'completed'
								? 'border-indigo-500 bg-indigo-50 text-indigo-700'
								: 'border-slate-200 text-slate-500 hover:border-slate-300'
						}`}
					>
						Completed
					</button>
				</div>

				{loading ? (
					<div className='py-6 text-sm text-slate-500'>Загрузка задач...</div>
				) : tasks.length === 0 ? (
					<div className='py-6 text-sm text-slate-500'>
						У вас пока нет задач на сегодня. Добавьте первую!
					</div>
				) : (
					<div className='space-y-3'>
						{filteredTasks.map(task => (
							<Task
								key={task.id}
								task={task}
								onToggleCompleted={handleToggleCompleted}
								onDelete={handleDeleteTask}
							/>
						))}
					</div>
				)}

				{totalToday > 0 && (
					<div className='mt-4 flex items-center justify-between text-xs text-slate-500'>
						<Text>
							Complete your daily tasks to reach your goals! ({completedToday} of{' '}
							{totalToday} completed)
						</Text>
					</div>
				)}
			</div>

			{showGoalsSummary && (
				<div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow'>
					<Heading title='Goals Progress' />
					<Text>Track your progress towards your main goals</Text>

					{goalsError && (
						<div className='mt-4 mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600'>
							{goalsError}
						</div>
					)}

					{goalsLoading ? (
						<div className='mt-6 text-sm text-slate-500'>Загрузка целей...</div>
					) : goals.length === 0 ? (
						<div className='mt-6 text-sm text-slate-500'>
							У вас пока нет целей. Создайте их на вкладке Goals.
						</div>
					) : (
						<div className='mt-6 space-y-6'>
							{goals.map(goal => (
								<div key={goal.id}>
									<div className='flex items-center justify-between mb-3'>
										<strong className='font-semibold text-slate-800'>
											{goal.title}
										</strong>
										<span className='text-sm font-bold text-indigo-600'>
											{goal.progress}%
										</span>
									</div>
									<div className='relative h-3 bg-slate-200 rounded-full overflow-hidden'>
										<div
											className='absolute top-0 left-0 h-full bg-linear-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 shadow-sm'
											style={{ width: `${goal.progress}%` }}
										>
											<div className='absolute inset-0 bg-white/20 animate-pulse'></div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					<div className='mt-6'>
						<Button
							title='+ Add New Goal'
							variant='dashed'
							type='button'
							onClick={() => router.push('/goals')}
						/>
					</div>
				</div>
			)}
		</section>
	)
}
