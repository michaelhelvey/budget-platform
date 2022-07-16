import type { User } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { prisma } from '~/lib/db.server'

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
export async function createUser(args: CreateUserArgs) {
	const hashedPassword = await bcrypt.hash(args.password, 10)

	return prisma.user.create({
		data: {
			...args,
			password: hashedPassword,
		},
	})
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
