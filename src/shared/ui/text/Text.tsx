export default function Text({
	children,
	align = 'left',
	size = 'sm',
}: {
	children?: React.ReactNode
	align?: 'left' | 'center' | 'right'
	size?: 'xs' | 'sm' | 'base'
}) {
	const alignments = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right',
	}

	const sizes = {
		xs: 'text-xs',
		sm: 'text-sm',
		base: 'text-base',
	}

	return (
		<p className={`${sizes[size]} ${alignments[align]} text-slate-500 mt-2`}>
			{children}
		</p>
	)
}
