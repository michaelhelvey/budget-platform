import { LoaderFunction } from '@remix-run/server-runtime'
import { requireUser } from '~/session.server'
import { useUser } from '~/utils'

export const loader: LoaderFunction = async ({ request }) => {
	await requireUser(request)
	return null
}

export default function Dashboard() {
	const user = useUser()

	return <div>Welcome to your dashboard, {user.firstName}</div>
}