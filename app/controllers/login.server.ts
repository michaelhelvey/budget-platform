import { z } from 'zod'
import type { SchemaValidationResponse } from '~/lib/schema'
import { mapZodError } from '~/lib/schema'
import { validateEmail } from '~/lib/utils'

const loginSchema = z.object({
	email: z.string().refine(validateEmail, 'Please enter a valid email'),
	password: z.string(),
})

export type LoginValidationResponse = SchemaValidationResponse<
	typeof loginSchema
>

export function validateLoginForm(request: unknown): LoginValidationResponse {
	const parseResult = loginSchema.safeParse(request)

	if (parseResult.success) {
		return { state: 'success', data: parseResult.data }
	}

	return { state: 'error', error: mapZodError(parseResult.error) }
}
