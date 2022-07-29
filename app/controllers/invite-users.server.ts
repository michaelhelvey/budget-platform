import { z } from 'zod'
import type { SchemaValidationResponse } from '~/lib/schema';
import { formError, mapZodError } from '~/lib/schema'
import { getUserId } from '~/lib/session.server'
import { validateEmail } from '~/lib/utils'
import type { User } from '~/models/user.server';
import { getUserByEmail } from '~/models/user.server'
import {
	createUserInvitation,
	getInvitationsForAccount,
	getUserInvitationByEmail,
} from '~/models/userInvitation.server'

const userInvitationCreationSchema = z.object({
	email: z.string().refine(validateEmail, 'Please enter a valid email'),
})

export type UserInvitationValidationResponse = SchemaValidationResponse<
	typeof userInvitationCreationSchema
>

export async function validateUserInvitationForm(
	request: unknown
): Promise<UserInvitationValidationResponse> {
	const result = userInvitationCreationSchema.safeParse(request)

	if (!result.success) {
		return { state: 'error', error: mapZodError(result.error) }
	}

	const existingUser = await getUserByEmail(result.data.email)
	if (existingUser) {
		return {
			state: 'error',
			error: formError('email', 'A user with this email already exists'),
		}
	}

	const existingInvitation = await getUserInvitationByEmail(result.data.email)
	if (existingInvitation) {
		return {
			state: 'error',
			error: formError('email', 'An invitation for this email already exists'),
		}
	}

	return { state: 'success', data: result.data }
}

export async function onSuccessUserInvitationFormValidation(
	data: z.output<typeof userInvitationCreationSchema>,
	request: Request
) {
	const currentUser = await getUserId(request)
	return createUserInvitation(data.email, currentUser)
}

export async function getUserInvitations(userId: User['id']) {
	const invitations = await getInvitationsForAccount(userId)
	return invitations
}
