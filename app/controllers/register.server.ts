import { z } from 'zod'
import type { SchemaValidationResponse } from '~/lib/schema'
import { formError, mapZodError } from '~/lib/schema'
import { validateEmail } from '~/lib/utils'
import { createUser, getUserByEmail } from '~/models/user.server'

const PASSWORD_MIN_LENGTH = 8
const NAME_MAX_LEN = 50
const NAME_MIN_LEN = 1

const nameField = z
	.string()
	.max(
		NAME_MAX_LEN,
		`Provided value is too long (max ${NAME_MAX_LEN} character(s))`
	)
	.min(
		NAME_MIN_LEN,
		`Provided value is too short (min ${NAME_MIN_LEN} character(s))`
	)

const passwordField = z
	.string()
	.min(8, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)

const registerFormSchema = z.object({
	firstName: nameField,
	lastName: nameField,
	email: z.string().refine(validateEmail, 'Please enter a valid email'),
	password: passwordField,
	confirmPassword: passwordField,
})

export type RegisterValidationResponse = SchemaValidationResponse<
	typeof registerFormSchema
>

export async function validateRegisterForm(
	request: unknown
): Promise<RegisterValidationResponse> {
	const result = registerFormSchema.safeParse(request)

	if (!result.success) {
		return { state: 'error', error: mapZodError(result.error) }
	}

	const { password, confirmPassword } = result.data

	if (password !== confirmPassword) {
		return {
			state: 'error',
			error: formError('password', 'Passwords do not match'),
		}
	}

	const user = await getUserByEmail(result.data.email)

	if (user) {
		return {
			state: 'error',
			error: formError('email', 'A user with this email already exists'),
		}
	}

	return { state: 'success', data: result.data }
}

export async function onSuccessRegisterFormValidation(
	request: z.output<typeof registerFormSchema>
) {
	return createUser(request)
}
