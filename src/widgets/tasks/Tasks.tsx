import Task from '@/entities/task/Task'
import { goals } from '@/shared/config/dashboard'
import Button from '@/shared/ui/button'
import Heading from '@/shared/ui/heading'
import Text from '@/shared/ui/text'

export default function Tasks() {
	return (
		<section className='grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6'>
			<div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow'>
				<div className='flex items-center justify-between mb-6'>
					<Heading title="Today's Tasks" />
					<Button title='+ Add Task' variant='primary' />
				</div>
				<div className='space-y-3'>
					<Task />
					<Task />
					<Task />
				</div>
				<Text>Complete your daily tasks to reach your goals!</Text>
			</div>

			<div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow'>
				<Heading title='Goals Progress' />
				<Text>Track your progress towards your main goals</Text>

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
							<div className='mt-2 text-xs text-slate-500'>
								{Math.round((goal.progress / 100) * 10)} of 10 milestones
								completed
							</div>
						</div>
					))}
				</div>

				<Button title='+ Add New Goal' variant='dashed' />
			</div>
		</section>
	)
}
