import { vi } from 'vitest'
import { prisma } from '~/lib/db.server'

import { createOrganization, _private } from '~/models/organization.server'

const { nameToSlug } = _private

describe('createOrganization', () => {
	it('given a name, create a new organization', async () => {
		const spy = vi
			.spyOn(prisma.organization, 'create')
			.mockResolvedValueOnce('foo' as any)

		const result = await createOrganization('My Org')
		expect(result).toMatchObject('foo')

		expect(spy).toHaveBeenCalledWith({
			data: { name: 'My Org', slug: 'my-org' },
		})
	})
})

describe('nameToSlug', () => {
	// smoke tests where we try to break the algorithm a bit:
	const table = [
		['My Org', 'my-org'],
		["Michael Helvey's Family", 'michael-helveys-family'],
		['my!#very%20stupid ^ thing', 'myvery20stupid--thing'],
	]

	it.each(table)('creates valid slug - %s', (name, expected) => {
		expect(nameToSlug(name)).toEqual(expected)
	})
})
