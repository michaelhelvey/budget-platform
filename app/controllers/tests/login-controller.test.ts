import type {
	LoginValidationResponse} from '~/controllers/login.server';
import {
	validateLoginForm,
} from '~/controllers/login.server'

describe('validateLoginForm', () => {
	it('given a valid schema, returns data', () => {
		const request = { email: 'foo@bar.com', password: '1234' }

		const result = validateLoginForm(request)

		expect(result.state).toEqual('success')
		expect(
			(result as Extract<LoginValidationResponse, { state: 'success' }>).data
		).toEqual(request)
	})

	it('given an invalid schema, returns errors', () => {
		const request = { email: 'foo.com', password: '1234' }

		const result = validateLoginForm(request)
		expect(result.state).toEqual('error')
		expect(
			(result as Extract<LoginValidationResponse, { state: 'error' }>).error
				.errors.email
		).toEqual('Please enter a valid email')
	})
})
