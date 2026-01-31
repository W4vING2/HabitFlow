export type Goal = {
	id: number
	title: string
	progress: number
}

export type GoalEntity = Goal & {
	userId: string
}

export type Stat = {
	label: string
	value: string | number
}
