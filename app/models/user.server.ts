import type { Organization, User } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { prisma } from '~/lib/db.server'
import { createOrganization } from './organization.server'

export type { User } from '@prisma/client'

export async function getUserById(id: User['id']) {
	return prisma.user.findUnique({ where: { id } })
}

export async function getUserByEmail(email: User['email']) {
	return prisma.user.findUnique({ where: { email } })
}

type CreateUserArgs = Pick<
	User,
	'firstName' | 'lastName' | 'email' | 'password'
>

/**
 * There are basically two flows for creating a user:
 *
 * 1) Create a new organization for the user, because they are creating their
 * account independently (the default behavior),
 *
 * 2) Create the user with an organization specified (e.g. as the result of a
 * user invitation)
 */
export async function createUser(
	args: CreateUserArgs,
	organization?: Organization
) {
	const hashedPassword = await bcrypt.hash(args.password, 10)

	if (!organization) {
		organization = await createOrganization(
			userNameToOrgName(args.firstName, args.lastName)
		)
	}

	return prisma.user.create({
		data: {
			...args,
			password: hashedPassword,
			organizationId: organization.id,
		},
	})
}

function userNameToOrgName(firstName: string, lastName: string): string {
	return `${firstName} ${lastName}'s Family`
}

export async function deleteUserByEmail(email: User['email']) {
	return prisma.user.delete({ where: { email } })
}

export async function verifyLogin(
	email: User['email'],
	password: User['password']
) {
	const userWithPassword = await prisma.user.findUnique({
		where: { email },
	})

	if (!userWithPassword || !userWithPassword.password) {
		return null
	}

	const isValid = await bcrypt.compare(password, userWithPassword.password)

	if (!isValid) {
		return null
	}

	const { password: _password, ...userWithoutPassword } = userWithPassword

	return userWithoutPassword
}
