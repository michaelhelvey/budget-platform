import { prisma } from '~/lib/db.server'
import type { User } from '~/models/user.server'

export type { UserInvitation } from '@prisma/client'

export async function createUserInvitation(email: string, from: User['id']) {
	return prisma.userInvitation.create({
		data: { email, userId: from },
	})
}

export async function getUserInvitationByEmail(email: string) {
	return prisma.userInvitation.findUnique({ where: { email } })
}

export async function getInvitationsForAccount(owningAccount: User['id']) {
	return prisma.userInvitation.findMany({ where: { userId: owningAccount } })
}
