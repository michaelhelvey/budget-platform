import type {
	ActionFunction,
	LoaderFunction,
	MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useActionData, useSearchParams } from '@remix-run/react'
import * as React from 'react'
import {
	StyledAuthForm,
	StyledAuthInput,
	StyledAuthSubmitButton,
} from '~/components/auth/form'
import { LogoIcon } from '~/components/icons/Logo'
import type { LoginValidationResponse } from '~/controllers/login.server'
import { validateLoginForm } from '~/controllers/login.server'

import { formError } from '~/lib/schema'
import { createUserSession, getUserId } from '~/lib/session.server'
import { safeRedirect } from '~/lib/utils'
import { verifyLogin } from '~/models/user.server'

const DEFAULT_LOGIN_REDIRECT = '/dashboard'

export const loader: LoaderFunction = async ({ request }) => {
	const userId = await getUserId(request)
	if (userId) return redirect(DEFAULT_LOGIN_REDIRECT)
	return json({})
}

type ActionData = Extract<LoginValidationResponse, { state: 'error' }>['error']

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData()
	const redirectTo = safeRedirect(
		formData.get('redirectTo'),
		DEFAULT_LOGIN_REDIRECT
	)
	const remember = formData.get('remember')

	const validationResult = validateLoginForm(
		Object.fromEntries(formData.entries())
	)

	if (validationResult.state === 'error') {
		return json<ActionData>(validationResult.error, { status: 400 })
	}

	const { email, password } = validationResult.data

	const user = await verifyLogin(email, password)

	if (!user) {
		return json<ActionData>(formError('email', 'Invalid email or password'), {
			status: 400,
		})
	}

	return createUserSession({
		request,
		userId: user.id,
		remember: remember === 'on' ? true : false,
		redirectTo,
	})
}

export const meta: MetaFunction = () => {
	return {
		title: 'Login',
	}
}

export default function LoginPage() {
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo') || DEFAULT_LOGIN_REDIRECT
	const actionData = useActionData<ActionData>()
	const emailRef = React.useRef<HTMLInputElement>(null)
	const passwordRef = React.useRef<HTMLInputElement>(null)

	React.useEffect(() => {
		if (actionData?.errors?.email) {
			emailRef.current?.focus()
		} else if (actionData?.errors?.password) {
			passwordRef.current?.focus()
		}
	}, [actionData])

	return (
		<div className="flex min-h-full flex-col justify-center bg-gray-50 py-8">
			<div className="mx-auto w-full max-w-lg px-8">
				<div className="flex flex-1 items-center justify-center">
					<LogoIcon className="h-10 w-10 text-blue-700" />
				</div>
				<h1 className="mt-4 text-center text-3xl font-bold">Log In</h1>
				<div className="mt-2 text-center text-sm text-slate-800">
					Or{' '}
					<Link
						to={{
							pathname: '/register',
							search: searchParams.toString(),
						}}
						className="font-semibold text-blue-700"
					>
						create a new account
					</Link>
				</div>
				<StyledAuthForm>
					<StyledAuthInput
						name="email"
						labelText="Email address"
						autoFocus
						autoComplete="email"
						type="email"
						error={actionData?.errors?.email}
					/>

					<StyledAuthInput
						name="password"
						labelText="Password"
						autoComplete="current-password"
						type="password"
						error={actionData?.errors?.password}
					/>

					<input type="hidden" name="redirectTo" value={redirectTo} />
					<div className="flex flex-wrap items-center justify-between space-y-4 sm:space-y-0">
						<div className="flex items-center">
							<input
								id="remember"
								name="remember"
								type="checkbox"
								className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<label
								htmlFor="remember"
								className="ml-2 block text-sm text-gray-900"
							>
								Remember me
							</label>
						</div>
						<Link
							className="text-sm font-medium text-blue-700"
							to={'/forgot-password'}
						>
							Forgot your password?
						</Link>
					</div>
					<StyledAuthSubmitButton>Log in</StyledAuthSubmitButton>
				</StyledAuthForm>
			</div>
		</div>
	)
}
