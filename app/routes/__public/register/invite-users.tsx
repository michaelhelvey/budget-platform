import {
	Link,
	useActionData,
	useLoaderData,
	useTransition,
} from '@remix-run/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime'
import { useEffect, useRef } from 'react'
import {
	StyledAuthForm,
	StyledAuthInput,
	StyledAuthSubmitButton,
} from '~/components/auth/form'
import { ArrowRightIcon } from '~/components/icons/ArrowRight'
import { CheckMarkIcon } from '~/components/icons/CheckMark'
import { LogoIcon } from '~/components/icons/Logo'
import type {
	UserInvitationValidationResponse} from '~/controllers/invite-users.server';
import {
	getUserInvitations,
	onSuccessUserInvitationFormValidation,
	validateUserInvitationForm,
} from '~/controllers/invite-users.server'
import { requireUserId } from '~/lib/session.server'

type ActionData = Extract<
	UserInvitationValidationResponse,
	{ state: 'error' }
>['error']

export const loader = async ({ request }: LoaderArgs) => {
	const userId = await requireUserId(request)
	const invitations = await getUserInvitations(userId)
	return json({ invitations })
}

export const action = async ({ request }: ActionArgs) => {
	const formData = await request.formData()

	const validationResult = await validateUserInvitationForm(
		Object.fromEntries(formData.entries())
	)

	if (validationResult.state === 'error') {
		return json<ActionData>(validationResult.error, { status: 400 })
	}

	await onSuccessUserInvitationFormValidation(validationResult.data, request)

	// we have nothing to return -- the loader will load the new invitation, and
	// we must wait for a specific navigation event from the user to move on from the page.
	return null
}

export default function RegisterInviteUsers() {
	const actionData = useActionData<ActionData>()
	const { invitations } = useLoaderData<typeof loader>()
	const transition = useTransition()

	const isAdding = transition.state === 'submitting'

	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (!isAdding) {
			formRef.current?.reset()
		}
	}, [isAdding])

	return (
		<div>
			<div className="mx-auto w-full max-w-lg px-8">
				<div className="flex flex-1 items-center justify-center">
					<LogoIcon className="h-10 w-10 text-blue-700" />
				</div>
				<h1 className="mt-4 text-center text-3xl font-bold">
					Invite New Users
				</h1>
				<div className="mt-2 text-center text-sm text-slate-800">
					Your new account is all set up. You can add other users to your
					account now, or{' '}
					<Link to="/dashboard" className="font-semibold text-blue-700">
						continue to your dashboard.
					</Link>{' '}
					You can always invite other users later.
				</div>
				<StyledAuthForm replace ref={formRef}>
					<span className="text-sm italic text-slate-700">
						This will create an invitation so that when the user you specify
						here by email creates their account, they will be automatically
						share your settings & budget.
					</span>
					<div>
						{invitations.map((invitation) => (
							<div
								className="flex justify-between border-t border-slate-200 py-4 text-sm"
								key={invitation.id}
							>
								<div className="flex items-center space-x-3">
									<CheckMarkIcon className="h-5 w-5 text-green-700" />
									<span className="font-semibold">{invitation.email}</span>
								</div>
								<span className="rounded border border-yellow-300 bg-yellow-100 py-1 px-3 text-xs font-semibold text-yellow-700">
									Invitation Pending
								</span>
							</div>
						))}
					</div>
					<StyledAuthInput
						name="email"
						type="email"
						autoFocus
						labelText="Email"
						error={actionData?.errors.email}
					></StyledAuthInput>
					<StyledAuthSubmitButton disabled={isAdding}>
						Invite {invitations.length ? 'another' : ''} user
					</StyledAuthSubmitButton>
					{invitations.length ? (
						<Link
							to="/dashboard"
							className="flex items-center justify-end text-sm text-slate-800 underline"
						>
							<span>Continue To Dashboard</span>
							<ArrowRightIcon className="ml-2 h-3 w-3 text-slate-800" />
						</Link>
					) : null}
				</StyledAuthForm>
			</div>
		</div>
	)
}
