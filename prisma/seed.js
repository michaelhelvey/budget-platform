const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seed() {
	const email = 'michael@example.com'

	// cleanup the existing database
	await prisma.user.delete({ where: { email } }).catch(() => {
		// no worries if it doesn't exist yet
	})

	const hashedPassword = await bcrypt.hash('1234', 10)

	const org = await prisma.organization.create({
		data: {
			name: "Michael Helvey's Family",
			slug: 'helvey-family',
		},
	})

	await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			firstName: 'Michael',
			lastName: 'Helvey',
			organizationId: org.id,
		},
	})

	console.log(`Database has been seeded. 🌱`)
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
