import { prisma } from '~/lib/db.server'
import {
	createUserInvitation,
	getInvitationsForAccount,
	getUserInvitationByEmail,
} from '~/models/userInvitation.server'

describe('createUserInvitation', () => {
	test('given valid arguments, creates a new user invitation', async () => {
		const spy = vi
			.spyOn(prisma.userInvitation, 'create')
			.mockResolvedValueOnce('foo' as any)
		await expect(
			createUserInvitation('woo@foo.com', 'bar' as any)
		).resolves.toEqual('foo')

		expect(spy).toHaveBeenCalledWith({
			data: { email: 'woo@foo.com', userId: 'bar' },
		})
	})
})

describe('getUserInvitationByEmail', () => {
	test('gets a user invitation by email', async () => {
		const spy = vi
			.spyOn(prisma.userInvitation, 'findUnique')
			.mockResolvedValueOnce('foo' as any)
		await expect(getUserInvitationByEmail('foo')).resolves.toEqual('foo')
		expect(spy).toHaveBeenCalledWith({ where: { email: 'foo' } })
	})
})

describe('getInvitationsForAcount', () => {
	test('gets invitations for owning account', async () => {
		const spy = vi
			.spyOn(prisma.userInvitation, 'findMany')
			.mockResolvedValueOnce('foo' as any)

		await expect(getInvitationsForAccount('foo' as any)).resolves.toEqual('foo')
		expect(spy).toHaveBeenCalledWith({ where: { userId: 'foo' } })
	})
})
