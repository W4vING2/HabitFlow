export default function Heading({
	title,
	size = 'lg',
}: {
	title: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
	const sizes = {
		sm: 'text-base font-semibold text-slate-800',
		md: 'text-lg font-bold text-slate-800',
		lg: 'text-xl font-bold text-slate-800',
		xl: 'text-3xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent',
	}

	return <h3 className={sizes[size]}>{title}</h3>
}
