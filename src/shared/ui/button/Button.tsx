export default function Button({ title }: { title: string }) {
	return (
		<button
			type='submit'
			className='mt-2 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition'
		>
			{title}
		</button>
	)
}
