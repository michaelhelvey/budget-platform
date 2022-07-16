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
