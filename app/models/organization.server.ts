import { prisma } from '~/lib/db.server'

export type { Organization } from '@prisma/client'

export async function createOrganization(name: string) {
	return prisma.organization.create({
		data: { name, slug: nameToSlug(name) },
	})
}

function nameToSlug(str: string): string {
	// Fairly naive yes, so just falls back on encodeURIComponent in case we
	// missed anything crazy
	const replaced = str
		.replace(/ /g, '-')
		.replace(/['"!@#$%^&*()]/g, '')
		.toLowerCase()
	return encodeURIComponent(replaced)
}

export const _private = { nameToSlug }
