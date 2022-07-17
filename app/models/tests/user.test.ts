import bcrypt from 'bcryptjs'
import { vi } from 'vitest'
import { prisma } from '~/lib/db.server'
import type { Organization } from '~/models/organization.server'
import { createOrganization } from '~/models/organization.server'
import {
	createUser,
	deleteUserByEmail,
	getUserByEmail,
	getUserById,
	verifyLogin,
} from '~/models/user.server'

vi.mock('bcryptjs', async () => {
	const actual = await vi.importActual<{ default: typeof bcrypt }>('bcryptjs')
	return { __esModule: true, default: { ...actual.default, compare: vi.fn() } }
})

vi.mock('~/models/organization.server', () => {
	return {
		createOrganization: vi.fn(),
	}
})

afterEach(() => {
	vi.restoreAllMocks()
})

describe('getUserById', () => {
	it('given a user in prisma, returns that user', async () => {
		const spy = vi
			.spyOn(prisma.user, 'findUnique')
			.mockResolvedValueOnce('foo' as any)

		expect(await getUserById('1234')).toEqual('foo')
		expect(spy).toHaveBeenCalledWith({ where: { id: '1234' } })
	})
})

describe('getUserByEmail', () => {
	it('given a user in prisma, returns that user by email', async () => {
		const spy = vi
			.spyOn(prisma.user, 'findUnique')
			.mockResolvedValueOnce('foo' as any)

		expect(await getUserByEmail('blah')).toEqual('foo')
		expect(spy).toHaveBeenCalledWith({ where: { email: 'blah' } })
	})
})

describe('createUser', () => {
	const args = {
		firstName: 'Rumpel',
		lastName: 'Stiltskin',
		email: 'rumpel@example.com',
		password: '1234asdf',
	}
	it('given args as a dictionary, creates a user with an organization', async () => {
		const userCreateSpy = vi
			.spyOn(prisma.user, 'create')
			.mockResolvedValueOnce('foo' as any)

		const orgCreateSpy = vi
			.mocked(createOrganization)
			.mockResolvedValueOnce({ id: 'returned-org-id' } as any)

		expect(await createUser(args)).toEqual('foo')

		expect(orgCreateSpy).toHaveBeenCalledWith("Rumpel Stiltskin's Family")
		expect(userCreateSpy).toHaveBeenCalledWith({
			data: {
				...args,
				password: expect.stringContaining('$2a'), // should be a bcrypt hashed password
				organizationId: 'returned-org-id',
			},
		})
	})

	it('given an existing organization, attaches user to that org', async () => {
		const userCreateSpy = vi
			.spyOn(prisma.user, 'create')
			.mockResolvedValueOnce('foo' as any)

		expect(await createUser(args, { id: '123' } as Organization)).toEqual('foo')
		expect(userCreateSpy).toHaveBeenCalledWith({
			data: {
				...args,
				password: expect.stringContaining('$2a'), // should be a bcrypt hashed password
				organizationId: '123',
			},
		})
	})
})

describe('deleteUserByEmail', () => {
	it('given a user with an email, deletes that user', async () => {
		const spy = vi
			.spyOn(prisma.user, 'delete')
			.mockResolvedValueOnce('foo' as any)

		expect(await deleteUserByEmail('blah')).toEqual('foo')
		expect(spy).toHaveBeenCalledWith({ where: { email: 'blah' } })
	})
})

describe('verifyLogin', () => {
	it('given a no user with email, returns null', async () => {
		const spy = vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null)

		expect(await verifyLogin('foo', 'bar')).toEqual(null)
		expect(spy).toHaveBeenCalledWith({ where: { email: 'foo' } })
	})

	it('given a user that exists but has no password, returns null', async () => {
		const spy = vi
			.spyOn(prisma.user, 'findUnique')
			.mockResolvedValueOnce({ email: 'hi' } as any)

		expect(await verifyLogin('foo', 'bar')).toEqual(null)
		expect(spy).toHaveBeenCalledWith({ where: { email: 'foo' } })
	})

	it('given a user with a not matching password, returns null', async () => {
		const spy = vi
			.spyOn(prisma.user, 'findUnique')
			.mockResolvedValueOnce({ email: 'hi', password: 'quux' } as any)

		expect(await verifyLogin('foo', 'boo')).toEqual(null)
		expect(spy).toHaveBeenCalledWith({ where: { email: 'foo' } })
		expect(bcrypt.compare).toHaveBeenCalledWith('boo', 'quux')
	})

	it('given a user with a matching password, returns the user', async () => {
		const spy = vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
			email: 'definitely@arealuser.com',
			password: 'quux',
		} as any)

		vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as any)

		expect(await verifyLogin('foo', 'boo')).toMatchObject({
			email: 'definitely@arealuser.com',
		})
		expect(spy).toHaveBeenCalledWith({ where: { email: 'foo' } })
		expect(bcrypt.compare).toHaveBeenCalledWith('boo', 'quux')
	})
})
