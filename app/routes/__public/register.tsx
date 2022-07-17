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

import { createUserSession, getUserId } from '~/lib/session.server'

import { safeRedirect } from '~/lib/utils'

export const loader: LoaderFunction = async ({ request }) => {
	const userId = await getUserId(request)
	if (userId) return redirect('/')
	return json({})
}

type ActionData = Extract<
	RegisterValidationResponse,
	{ state: 'error' }
>['error']

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData()
	const redirectTo = safeRedirect(formData.get('redirectTo'), '/')

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

export default function CreateAccount() {
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo') ?? undefined
	const actionData = useActionData() as ActionData
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
						error={actionData?.errors?.firstName}
					/>

					<StyledAuthInput
						name="lastName"
						labelText="Last Name"
						type="text"
						error={actionData?.errors?.lastName}
					/>

					<StyledAuthInput
						name="email"
						labelText="Email address"
						autoComplete="email"
						type="email"
						error={actionData?.errors?.email}
					/>

					<StyledAuthInput
						name="password"
						labelText="Password"
						type="password"
						error={actionData?.errors?.password}
					/>

					<StyledAuthInput
						name="confirmPassword"
						labelText="Confirm Password"
						type="password"
						error={actionData?.errors?.confirmPassword}
					/>

					<input type="hidden" name="redirectTo" value={redirectTo} />
					<StyledAuthSubmitButton>Create Account</StyledAuthSubmitButton>
				</StyledAuthForm>
			</div>
		</div>
	)
}
