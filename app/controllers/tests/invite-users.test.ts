import { extractErrorForField } from '~/lib/schema'
import { getUserByEmail } from '~/models/user.server'
import { getUserInvitationByEmail } from '~/models/userInvitation.server'
import type {
	UserInvitationValidationResponse} from '../invite-users.server';
import {
	validateUserInvitationForm,
} from '../invite-users.server'

type Success = Extract<UserInvitationValidationResponse, { state: 'success' }>
type Error = Extract<UserInvitationValidationResponse, { state: 'error' }>

vi.mock('~/models/user.server', async () => {
	const actual = await vi.importActual<Record<string, unknown>>(
		'~/models/user.server'
	)

	return {
		...actual,
		getUserByEmail: vi.fn(),
	}
})

vi.mock('~/models/userInvitation.server', async () => {
	const actual = await vi.importActual<Record<string, unknown>>(
		'~/models/userInvitation.server'
	)

	return {
		...actual,
		getUserInvitationByEmail: vi.fn(),
	}
})

describe('validateUserInvitationForm', () => {
	const request = {
		email: 'blah@blah.com',
	}

	test('given validate form, returns form data', async () => {
		const validationResult = await validateUserInvitationForm(request)
		expect(validationResult.state).toEqual('success')
		expect((validationResult as Success).data).toMatchObject(request)
	})

	test('given invalid form, returns form errors', async () => {
		const validationResult = await validateUserInvitationForm({
			...request,
			email: 'not a real email',
		})
		expect(validationResult.state).toEqual('error')
		expect(
			extractErrorForField((validationResult as Error).error, 'email')
		).toEqual('Please enter a valid email')
	})

	test('given user with email that already exists, returns an error', async () => {
		vi.mocked(getUserByEmail).mockResolvedValueOnce({
			email: 'existing user',
		} as any)

		const validationResult = await validateUserInvitationForm(request)
		expect(validationResult.state).toEqual('error')
		expect(
			extractErrorForField((validationResult as Error).error, 'email')
		).toEqual('A user with this email already exists')
	})

	test('given user invitation with email that already exists, returns error', async () => {
		vi.mocked(getUserInvitationByEmail).mockResolvedValueOnce({
			email: 'existing user',
		} as any)

		const validationResult = await validateUserInvitationForm(request)
		expect(validationResult.state).toEqual('error')
		expect(
			extractErrorForField((validationResult as Error).error, 'email')
		).toEqual('An invitation for this email already exists')
	})
})
