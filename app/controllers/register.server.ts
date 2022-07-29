import { z } from 'zod'
import { config, nameField } from '~/lib/config'
import type { SchemaValidationResponse } from '~/lib/schema'
import { formError, mapZodError } from '~/lib/schema'
import { omitKeys, validateEmail } from '~/lib/utils'
import { createUser, getUserByEmail } from '~/models/user.server'

const passwordField = z
	.string()
	.min(8, `Password must be at least ${config.passwordMinLength} characters`)

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
	return createUser(omitKeys(request, 'confirmPassword'))
}
