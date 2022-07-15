import type { ActionFunction } from '@remix-run/node'
import { Form } from '@remix-run/react'

import { logout } from '~/session.server'

export const action: ActionFunction = async ({ request }) => {
	return logout(request)
}

export default function LogOut() {
	return (
		<div className="flex w-full flex-col items-center">
			<div className="w-full max-w-6xl">
				<h1 className="text-2xl font-bold text-blue-700">Log Out</h1>
				<p className="mt-4 text-slate-800">Are you sure you want to log out!</p>
				<Form method="post">
					<button
						type="submit"
						className="mt-4 rounded bg-blue-600 px-3 py-2 text-sm font-bold text-white"
					>
						Log Out
					</button>
				</Form>
			</div>
		</div>
	)
}
