import { useUser } from '~/lib/utils'

export default function DashboardPage() {
	const user = useUser()

	return (
		<div className="p-8">
			<h1 className="text-2xl font-semibold text-slate-900">
				Welcome to your dashboard,{' '}
				<span className="text-blue-700">{user.firstName}</span>
			</h1>
		</div>
	)
}
