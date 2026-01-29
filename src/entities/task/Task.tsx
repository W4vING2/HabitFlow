import Text from '@/shared/ui/text'

export default function Task({
	title = 'Finish React dashboard layout',
	dueTime = 'Due in 2 hours',
	priority = 'high',
	completed = false,
}: {
	title?: string
	dueTime?: string
	priority?: 'high' | 'medium' | 'low'
	completed?: boolean
}) {
	const priorityStyles = {
		high: 'bg-amber-100 text-amber-700',
		medium: 'bg-blue-100 text-blue-700',
		low: 'bg-green-100 text-green-700',
	}

	const priorityLabels = {
		high: 'High',
		medium: 'Medium',
		low: 'Low',
	}

	return (
		<div className='p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors group'>
			<div className='flex items-start gap-3'>
				<input
					type='checkbox'
					defaultChecked={completed}
					className='mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all'
				/>
				<div className='flex-1'>
					<p className='font-medium text-slate-800 group-hover:text-indigo-600 transition-colors'>
						{title}
					</p>
					<Text size='sm' align='left'>
						{dueTime}
					</Text>
				</div>
				<span
					className={`px-3 py-1 ${priorityStyles[priority]} rounded-full text-xs font-semibold`}
				>
					{priorityLabels[priority]}
				</span>
			</div>
		</div>
	)
}
