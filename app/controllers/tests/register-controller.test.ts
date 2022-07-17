import { vi } from 'vitest'

import type { RegisterValidationResponse } from '~/controllers/register.server'
import { validateRegisterForm } from '~/controllers/register.server'
import { getUserByEmail } from '~/models/user.server'

vi.mock('~/models/user.server', async () => {
	const actual = await vi.importActual<Record<string, unknown>>(
		'~/models/user.server'
	)

	return {
		...actual,
		getUserByEmail: vi.fn(),
	}
})

describe('validateRegisterForm', () => {
	const request = {
		firstName: 'Rupert',
		lastName: 'Foo',
		email: 'foo@bar.com',
		password: '1234asdf',
		confirmPassword: '1234asdf',
	}

	type Success = Extract<RegisterValidationResponse, { state: 'success' }>
	type Error = Extract<RegisterValidationResponse, { state: 'error' }>

	it('given a valid form, returns the data in the form', async () => {
		const result = await validateRegisterForm(request)

		expect(result.state).toEqual('success')
		expect((result as Success).data).toEqual(request)
	})

	const validations = [
		[
			'firstName',
			'must not be greater than 50 characters',
			stringWithLength(51),
			'error',
			/provided value is too long/i,
		],
		[
			'firstName',
			'must not be less than 1 character',
			'',
			'error',
			/provided value is too short/i,
		],
		[
			'lastName',
			'must not be greater than 50 characters',
			stringWithLength(51),
			'error',
			/provided value is too long/i,
		],
		[
			'lastName',
			'must not be less than 1 character',
			'',
			'error',
			/provided value is too short/i,
		],
		[
			'email',
			'must be a valid email',
			'foo.com',
			'error',
			/please enter a valid email/i,
		],
		[
			'password',
			'must be at least 8 characters',
			'1234',
			'error',
			/password must be at least 8 characters/i,
		],
		[
			'confirmPassword',
			'must be at least 8 characters',
			'1234',
			'error',
			/password must be at least 8 characters/i,
		],
	] as const

	it.each(validations)(
		'validate %s - %s',
		async (
			field: keyof Success['data'],
			_msg: string,
			value: string,
			state: RegisterValidationResponse['state'],
			match: RegExp
		) => {
			const result = await validateRegisterForm({ ...request, [field]: value })
			expect(result.state).toEqual(state)

			if (state !== 'error') {
				throw new Error(`table validation for state ${state} not supported`)
			}

			expect((result as Error).error.errors[field]).toMatch(match)
		}
	)

	it('given passwords that do not match, returns an error', async () => {
		const result = await validateRegisterForm({
			...request,
			password: 'asdf1234',
			confirmPassword: 'asdf1234zxcvd',
		})

		expect(result.state).toEqual('error')
		expect((result as Error).error.errors.password).toEqual(
			'Passwords do not match'
		)
	})

	it('given an email for a user that already exists, returns an error', async () => {
		vi.mocked(getUserByEmail).mockResolvedValueOnce({
			email: 'existing user',
		} as any)

		// when we validate the form, and getUserByEmail returns a value, then we
		// should get an error
		const result = await validateRegisterForm(request)
		expect(result.state).toEqual('error')
		expect((result as Error).error.errors.email).toEqual(
			'A user with this email already exists'
		)
	})
})

function stringWithLength(len: number): string {
	return Array(len + 1).join('a')
}
