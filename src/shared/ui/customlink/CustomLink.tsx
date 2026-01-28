import Link from 'next/link'

export default function CustomLink({
	href,
	title,
}: {
	href: string
	title: string
}) {
	return (
		<Link href={href} className='text-indigo-600 font-medium ml-1'>
			{title}
		</Link>
	)
}
