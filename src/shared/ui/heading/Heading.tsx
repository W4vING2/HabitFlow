export default function Heading({ title }: { title: string }) {
	return (
		<h1 className='text-3xl font-bold text-indigo-600 text-center mb-4'>
			{title}
		</h1>
	)
}
