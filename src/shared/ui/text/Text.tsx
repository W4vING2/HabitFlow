import { cn } from '@/shared/lib/utils'

export default function Text({
	children,
	align = 'left',
	size = 'sm',
	className,
}: {
	children?: React.ReactNode
	align?: 'left' | 'center' | 'right'
	size?: 'xs' | 'sm' | 'base'
	className?: string
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
		<p className={cn(`${sizes[size]} ${alignments[align]} text-slate-500`, className)}>
			{children}
		</p>
	)
}
