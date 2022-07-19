import { omitKeys, validateEmail } from '../utils'

test('validateEmail returns false for non-emails', () => {
	expect(validateEmail(undefined)).toBe(false)
	expect(validateEmail(null)).toBe(false)
	expect(validateEmail('')).toBe(false)
	expect(validateEmail('not-an-email')).toBe(false)
	expect(validateEmail('n@')).toBe(false)
})

test('validateEmail returns true for emails', () => {
	expect(validateEmail('kody@example.com')).toBe(true)
})

test('omitKeys returns an object without specified keys', () => {
	const object = { foo: 'hi', bar: 'there' }
	const result = omitKeys(object, 'bar')
	expect(result).toEqual({ foo: 'hi' })
})
