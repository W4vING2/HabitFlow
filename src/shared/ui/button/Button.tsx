export default function Button({
	title,
	variant = 'primary',
	onClick,
}: {
	title: string
	variant?: 'primary' | 'secondary' | 'dashed'
	onClick?: () => void
}) {
	const variants = {
		primary:
			'px-4 py-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all',
		secondary:
			'px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm',
		dashed:
			'w-full mt-4 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors font-medium text-sm',
	}

	return (
		<button type='submit' className={variants[variant]} onClick={onClick}>
			{title}
		</button>
	)
}
