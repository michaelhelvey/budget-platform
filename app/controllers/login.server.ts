import { z } from 'zod'
import type { SchemaErrorDefinition } from '~/lib/schema'
import { mapZodError } from '~/lib/schema'
import { validateEmail } from '~/lib/utils'

const loginSchema = z.object({
	email: z.string().refine(validateEmail),
	password: z.string(),
})

export type LoginValidationResponse =
	| {
			state: 'error'
			error: SchemaErrorDefinition<z.input<typeof loginSchema>>
	  }
	| {
			state: 'success'
			data: z.output<typeof loginSchema>
	  }

export function validateLoginForm(request: unknown): LoginValidationResponse {
	const parseResult = loginSchema.safeParse(request)

	if (parseResult.success) {
		return { state: 'success', data: parseResult.data }
	}

	return { state: 'error', error: mapZodError(parseResult.error) }
}
