// Use this to delete a user by their email
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/delete-user.ts username@example.com
// and that user will get deleted

import { installGlobals } from '@remix-run/node'
import { prisma } from '~/lib/db.server'

installGlobals()

async function cleanUpDatabase() {
	console.log('cleaning database: user, user_invitation, organization')
	await prisma.$executeRawUnsafe('DELETE FROM User')
	await prisma.$executeRawUnsafe('DELETE FROM UserInvitation')
	await prisma.$executeRawUnsafe('DELETE FROM Organization')
}

cleanUpDatabase()
