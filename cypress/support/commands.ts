import { faker } from '@faker-js/faker'

declare global {
	namespace Cypress {
		interface Chainable {
			/**
			 * Logs in with a random user. Yields the user and adds an alias to the user
			 *
			 * @returns {typeof login}
			 * @memberof Chainable
			 * @example
			 *    cy.login()
			 * @example
			 *    cy.login({ email: 'whatever@example.com' })
			 */
			login: typeof login

			cleanUpDatabase: typeof cleanUpDatabase
			createUser: typeof createUser
		}
	}
}

function createUser({ email, password }: { email: string; password: string }) {
	cy.then(() => ({ email, password })).as('user')
	cy.exec(
		`npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts "${email}" "${password}"`
	)
	return cy.get('@user')
}

function login({
	email = faker.internet.email(undefined, undefined, 'example.com'),
}: {
	email?: string
} = {}) {
	cy.then(() => ({ email })).as('user')
	cy.exec(
		`npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts "${email}"`
	).then(({ stdout }) => {
		const cookieValue = stdout
			.replace(/.*<cookie>(?<cookieValue>.*)<\/cookie>.*/s, '$<cookieValue>')
			.trim()
		cy.setCookie('__session', cookieValue)
	})
	return cy.get('@user')
}

function cleanUpDatabase() {
	cy.exec(
		`npx ts-node --require tsconfig-paths/register ./cypress/support/clean-db.ts`
	)
	cy.clearCookie('__session')
}

// For future reference, if we ever need to add back specific user deleltion,
// here's how we do it:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function deleteUserByEmail(email: string) {
	cy.exec(
		`npx ts-node --require tsconfig-paths/register ./cypress/support/delete-user.ts "${email}"`
	)
	cy.clearCookie('__session')
}

Cypress.Commands.add('login', login)
Cypress.Commands.add('createUser', createUser)
Cypress.Commands.add('cleanUpDatabase', cleanUpDatabase)

/*
eslint
  @typescript-eslint/no-namespace: "off",
*/
