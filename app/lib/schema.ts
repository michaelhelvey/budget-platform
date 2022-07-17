import type { ZodError } from 'zod'
import { z } from 'zod'

function safeJSONParse(val: unknown) {
	if (typeof val === 'string') {
		if (val === '') {
			return undefined
		}

		try {
			return JSON.parse(val)
		} catch {
			return val
		}
	}

	return val
}

type CasterFunction = (val: unknown) => any

export function cast<I extends z.ZodTypeAny>(
	schema: I,
	caster: CasterFunction = safeJSONParse as CasterFunction
): z.ZodEffects<I> {
	return z.preprocess<I>(caster, schema)
}

export type SchemaErrorDefinition<
	T extends Record<string, unknown> = Record<string, unknown>
> = {
	errors: { [key in keyof T]+?: string }
}

export function formError<T extends Record<string, unknown>>(
	field: keyof T,
	error: string
): SchemaErrorDefinition<T> {
	// TODO: figure out why typescript doesn't think key of T is a valid key.
	// Can't be bothered at the moment.
	return { errors: { [field]: error } } as SchemaErrorDefinition<T>
}

export function mapZodError<T extends Record<string, unknown>>(
	zodError: ZodError<T>
): SchemaErrorDefinition<T> {
	return Object.entries(zodError.format()).reduce(
		(errorMap, [field, errorDict]) => {
			// handle all the possible return types of format()...strictly speaking
			// given that we're limiting errors to schemas that extend from Record,
			// none of these cases (other than errorDict._errors) should ever take
			// place
			if (!errorDict) {
				return errorMap
			}

			if (Array.isArray(errorDict)) {
				errorMap.errors[field as keyof T] = errorDict[0]
			} else {
				errorMap.errors[field as keyof T] = errorDict._errors[0]
			}

			return errorMap
		},
		{ errors: {} } as SchemaErrorDefinition<T>
	)
}

export type SchemaValidationResponse<T extends z.AnyZodObject> =
	| {
			state: 'error'
			error: SchemaErrorDefinition<z.input<T>>
	  }
	| {
			state: 'success'
			data: z.output<T>
	  }
