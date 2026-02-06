'use client'

import type { GoalEntity } from '@/entities/dashboard/model'
import { Service } from '@/shared/api/apiService'
import Button from '@/shared/ui/button'
import Heading from '@/shared/ui/heading'
import Text from '@/shared/ui/text'
import { useGlobalStore } from '@/shared/store/globalStore'
import { useEffect, useState } from 'react'

type GoalForm = {
	title: string
	progress: number
}

export default function Goals() {
	const { currentUser } = useGlobalStore()
	const [goals, setGoals] = useState<GoalEntity[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [form, setForm] = useState<GoalForm>({ title: '', progress: 50 })
	const [editingId, setEditingId] = useState<number | null>(null)

	useEffect(() => {
		const load = async () => {
			if (!currentUser?.id) {
				setGoals([])
				return
			}
			try {
				setLoading(true)
				setError(null)
				const data = await Service.getGoals({ userId: currentUser.id })
				setGoals(data)
			} catch (e) {
				console.error(e)
				setError('Не удалось загрузить цели')
			} finally {
				setLoading(false)
			}
		}

		void load()
	}, [currentUser])

	const resetForm = () => {
		setForm({ title: '', progress: 50 })
		setEditingId(null)
	}

	const handleCreate = async () => {
		if (!currentUser?.id) {
			setError('Войдите, чтобы управлять целями')
			return
		}
		if (!form.title.trim()) return

		try {
			setError(null)
			const payload: Omit<GoalEntity, 'id'> = {
				title: form.title.trim(),
				progress: form.progress,
				userId: currentUser.id,
			}
			const created = await Service.createGoal(payload)
			setGoals(prev => [...prev, created])
			resetForm()
		} catch (e) {
			console.error(e)
			setError('Не удалось создать цель')
		}
	}

	const handleStartEdit = (goal: GoalEntity) => {
		setEditingId(goal.id)
		setForm({ title: goal.title, progress: goal.progress })
	}

	const handleUpdate = async () => {
		if (editingId == null) return
		if (!form.title.trim()) return

		const prev = goals
		const optimistic = goals.map(g =>
			g.id === editingId ? { ...g, title: form.title.trim(), progress: form.progress } : g,
		)
		setGoals(optimistic)

		try {
			await Service.updateGoal(editingId, {
				title: form.title.trim(),
				progress: form.progress,
			})
			resetForm()
		} catch (e) {
			console.error(e)
			setError('Не удалось обновить цель')
			setGoals(prev)
		}
	}

	const handleDelete = async (goal: GoalEntity) => {
		const prev = goals
		setGoals(goals.filter(g => g.id !== goal.id))
		try {
			await Service.deleteGoal(goal.id)
		} catch (e) {
			console.error(e)
			setError('Не удалось удалить цель')
			setGoals(prev)
		}
	}

	const isEditing = editingId !== null

	return (
		<section className='space-y-6'>
			<div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200/60 shadow-sm'>
				<div className='flex items-center justify-between mb-4'>
					<Heading title='Goals' />
					<Text>Управляйте своими основными целями</Text>
				</div>

				<div className='space-y-4 mb-5'>
					<div className='flex flex-col md:flex-row gap-3 md:items-center'>
						<input
							type='text'
							value={form.title}
							onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
							placeholder='Название цели (например, Выучить TypeScript)'
							className='flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500 bg-slate-50/60 text-gray-900'
						/>
						<div className='flex items-center gap-2 md:w-56'>
							<input
								type='range'
								min={0}
								max={100}
								value={form.progress}
								onChange={e =>
									setForm(prev => ({
										...prev,
										progress: Number(e.target.value),
									}))
								}
								className='flex-1 accent-indigo-500'
							/>
							<span className='w-10 text-xs font-semibold text-slate-600'>
								{form.progress}%
							</span>
						</div>
						<div className='md:w-auto w-full flex gap-2'>
							<Button
								title={isEditing ? 'Сохранить' : 'Добавить цель'}
								variant='primary'
								type='button'
								onClick={isEditing ? handleUpdate : handleCreate}
							/>
							{isEditing && (
								<Button
									title='Отмена'
									variant='secondary'
									type='button'
									onClick={resetForm}
								/>
							)}
						</div>
					</div>
					<Text size='sm'>
						Используйте прогресс для отслеживания уровня завершения цели (0–100%).
					</Text>
				</div>

				{error && (
					<div className='mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600'>
						{error}
					</div>
				)}

				{loading ? (
					<div className='py-4 text-sm text-slate-500'>Загрузка целей...</div>
				) : goals.length === 0 ? (
					<div className='py-4 text-sm text-slate-500'>
						У вас пока нет целей. Добавьте первую сверху.
					</div>
				) : (
					<div className='space-y-4'>
						{goals.map(goal => (
							<div
								key={goal.id}
								className='p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col gap-2'
							>
								<div className='flex items-center justify-between gap-3'>
									<div>
										<div className='font-semibold text-slate-800'>
											{goal.title}
										</div>
										<Text size='sm'>
											Прогресс: <span className='font-semibold'>{goal.progress}%</span>
										</Text>
									</div>
									<div className='flex items-center gap-2'>
										<Button
											title='Редактировать'
											variant='secondary'
											type='button'
											onClick={() => handleStartEdit(goal)}
										/>
										<Button
											title='Удалить'
											variant='secondary'
											type='button'
											onClick={() => handleDelete(goal)}
										/>
									</div>
								</div>
								<div className='h-2 bg-slate-200 rounded-full overflow-hidden'>
									<div
										className='h-full bg-linear-to-r from-indigo-500 to-purple-600 rounded-full transition-all'
										style={{ width: `${goal.progress}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	)
}
