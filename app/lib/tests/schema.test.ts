import { z } from 'zod'
import { cast } from '../schema'

describe('cast', () => {
	it('given schema with string, passes string through', () => {
		const schema = z.object({
			foo: cast(z.string()),
		})

		const result = schema.parse({ foo: 'blah' })
		expect(result.foo).toEqual('blah')
	})

	it('given schema with JSON parsable value: string in, parsed value out', () => {
		const schema = z.object({
			foo: cast(z.number()),
		})

		// @ts-expect-error TS will expect foo to be a number
		const validInput: z.input<typeof schema> = { foo: '2' }

		// and likewise the output should be a number:
		const result = schema.parse(validInput)
		expect(result.foo).toEqual(2)
	})

	it('given schema with non-string value, passes value through', () => {
		const schema = z.object({
			foo: cast(z.number()),
		})

		const validInput: z.input<typeof schema> = { foo: 2 }

		// and likewise the output should be a number:
		const result = schema.parse(validInput)
		expect(result.foo).toEqual(2)
	})

	it('given schema with optional value and empty string input, sets default', () => {
		// theory: default will not be called if optional is set on Effects
		const schema = z.object({
			foo: cast(z.number().default(2)),
		})

		const result = schema.parse({ foo: '' })
		expect(result.foo).toEqual(2)
	})

	it('given unparsable value, returns original', () => {
		const schema = z.object({
			foo: cast(z.string()),
		})

		const val = '{ "hello'
		const result = schema.parse({ foo: val })
		expect(result.foo).toEqual(val)
	})
})
