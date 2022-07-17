// Use this to completely empty the database to reset the state prior to a test
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/clean-db.ts
// and that user will get deleted

import { installGlobals } from '@remix-run/node'
import { prisma } from '~/lib/db.server'

installGlobals()

async function cleanUpDatabase() {
	await prisma.$executeRawUnsafe('DELETE FROM Organization')
	// TODO: ^ org should cascade, so determine if the below is necessary
	await prisma.$executeRawUnsafe('DELETE FROM User')
	await prisma.$executeRawUnsafe('DELETE FROM UserInvitation')
}

cleanUpDatabase()
