import { stats } from '@/shared/config/dashboard'

export default function Stats() {
	return (
		<section className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8'>
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
						<span>+12%</span>
					</div>
				</div>
			))}
		</section>
	)
}
