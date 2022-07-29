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
import type { RegisterValidationResponse } from '~/controllers/register.server'
import {
	onSuccessRegisterFormValidation,
	validateRegisterForm,
} from '~/controllers/register.server'
import { createUserSession, getMaybeUserId } from '~/lib/session.server'
import { safeRedirect } from '~/lib/utils'

export const loader: LoaderFunction = async ({ request }) => {
	const userId = await getMaybeUserId(request)
	if (userId) return redirect('/')
	return json({})
}

type ActionData = Extract<
	RegisterValidationResponse,
	{ state: 'error' }
>['error']

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData()

	const redirectTo = safeRedirect(
		formData.get('redirectTo'),
		'/register/invite-users'
	)

	const validationResult = await validateRegisterForm(
		Object.fromEntries(formData.entries())
	)

	if (validationResult.state === 'error') {
		return json<ActionData>(validationResult.error, { status: 400 })
	}

	const user = await onSuccessRegisterFormValidation(validationResult.data)

	return createUserSession({
		request,
		userId: user.id,
		remember: false,
		redirectTo,
	})
}

export const meta: MetaFunction = () => {
	return {
		title: 'Create Account',
	}
}

/**
 * Naively validates that the response from the server matches a kind of
 * response that we can handle.  Eventually, ideally we'd use something like zod
 * to be more explicit about this.
 */
function isActionDataValid(actionData: ActionData | undefined): boolean {
	if (actionData === undefined) {
		return true
	}

	if (actionData.errors) {
		return true
	}

	return false
}

export default function CreateAccount() {
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo') ?? undefined
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

	const unprocessableResponseError = !isActionDataValid(actionData)

	return (
		<div>
			<div className="mx-auto w-full max-w-lg px-8">
				<div className="flex flex-1 items-center justify-center">
					<LogoIcon className="h-10 w-10 text-blue-700" />
				</div>
				<h1 className="mt-4 text-center text-3xl font-bold">
					Create New Account
				</h1>
				<div className="mt-2 text-center text-sm text-slate-800">
					Or{' '}
					<Link
						to={{
							pathname: '/login',
							search: searchParams.toString(),
						}}
						className="font-semibold text-blue-700"
					>
						login to an existing account
					</Link>
				</div>
				<StyledAuthForm>
					<StyledAuthInput
						name="firstName"
						labelText="First Name"
						autoFocus
						type="text"
						required
						error={actionData?.errors?.firstName}
					/>

					<StyledAuthInput
						name="lastName"
						labelText="Last Name"
						type="text"
						required
						error={actionData?.errors?.lastName}
					/>

					<StyledAuthInput
						name="email"
						labelText="Email address"
						autoComplete="email"
						type="email"
						required
						error={actionData?.errors?.email}
					/>

					<StyledAuthInput
						name="password"
						labelText="Password"
						type="password"
						required
						error={actionData?.errors?.password}
					/>

					<StyledAuthInput
						name="confirmPassword"
						labelText="Confirm Password"
						type="password"
						required
						error={actionData?.errors?.confirmPassword}
					/>

					<input type="hidden" name="redirectTo" value={redirectTo} />
					{unprocessableResponseError ? (
						<div className="mt-1 text-sm text-red-700">
							The server returned an unprocessable response. This could mean
							that the server is down, but it probably means that you found a
							bug.
						</div>
					) : null}
					<StyledAuthSubmitButton>Create Account</StyledAuthSubmitButton>
				</StyledAuthForm>
			</div>
		</div>
	)
}
