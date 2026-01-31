import type { HabitTask, TaskPriority } from './model'
import Text from '@/shared/ui/text'

interface TaskProps {
	task: HabitTask
	onToggleCompleted?: (task: HabitTask) => void
	onDelete?: (task: HabitTask) => void
	onEdit?: (task: HabitTask) => void
}

export default function Task({ task, onToggleCompleted, onDelete, onEdit }: TaskProps) {
	const { title, date, priority = 'medium', completed } = task

	const priorityStyles = {
		high: 'bg-amber-100 text-amber-700',
		medium: 'bg-blue-100 text-blue-700',
		low: 'bg-green-100 text-green-700',
	} satisfies Record<TaskPriority, string>

	const priorityLabels: Record<TaskPriority, string> = {
		high: 'High',
		medium: 'Medium',
		low: 'Low',
	}

	const formattedDate =
		date &&
		new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: '2-digit',
		}).format(new Date(date))

	return (
		<div className='p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors group'>
			<div className='flex items-start gap-3'>
				<input
					type='checkbox'
					checked={completed}
					onChange={() => onToggleCompleted?.(task)}
					className='mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all'
				/>
				<div className='flex-1'>
					<p className='font-medium text-slate-800 group-hover:text-indigo-600 transition-colors'>
						{title}
					</p>
					{formattedDate && (
						<Text size='sm' align='left'>
							Due {formattedDate}
						</Text>
					)}
				</div>
				<span
					className={`px-3 py-1 ${priorityStyles[priority]} rounded-full text-xs font-semibold`}
				>
					{priorityLabels[priority]}
				</span>
				<div className='flex items-center gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity'>
					<button
						type='button'
						onClick={() => onEdit?.(task)}
						className='text-xs text-slate-500 hover:text-indigo-600'
					>
						Edit
					</button>
					<button
						type='button'
						onClick={() => onDelete?.(task)}
						className='text-xs text-red-500 hover:text-red-600'
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	)
}
