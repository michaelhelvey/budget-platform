import type { ActionFunction } from '@remix-run/node'
import { Form } from '@remix-run/react'

import { logout } from '~/session.server'

export const action: ActionFunction = async ({ request }) => {
	return logout(request)
}

/*
export const loader: LoaderFunction = async ({ request }) => {
	return redirect('/')
}
*/

export default function LogOut() {
	return (
		<div>
			<h1>Log Out</h1>
			<p>Are you sure you want to log out!</p>
			<Form method="post">
				<button type="submit">Yes, get me out.</button>
			</Form>
		</div>
	)
}
