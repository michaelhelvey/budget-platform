describe('Login', () => {
	before(() => {
		cy.cleanUpDatabase()
	})

	it('given a user with an email and password, they can log in and view their dashboard', () => {
		const loginForm = {
			email: 'rupert@example.com',
			password: '1234',
		}

		cy.createUser(loginForm)

		cy.visit('/')

		cy.findByRole('link', { name: /log in/i }).click()

		const $email = () => cy.findByRole('textbox', { name: /email/i })
		const $password = () => cy.findByLabelText(/password/i)
		const $submit = () => cy.findByRole('button', { name: /log in/i })

		// When the user types in wrong information, they should get an error
		// message:
		$email().type('somethingrandom@wrong.com')
		$password().type(loginForm.password)

		$submit().click()
		cy.findByText(/invalid email or password/i)

		// But when the user is correct, they should be logged in and taken to their
		// dashboard:
		$email().clear()
		$email().type(loginForm.email)
		$password().clear()
		$password().type(loginForm.password)
		$submit().click()

		cy.location('pathname').should('eq', '/dashboard')
	})

	it('given a logged in user, they can click log out to log out', () => {
		cy.login()

		cy.visit('/dashboard')

		cy.findByRole('link', { name: /log out/i }).click()
		cy.findByText(/are you sure you want to log out?/i)

		cy.findByRole('button', { name: /log out/i }).click()
		cy.location('pathname').should('eq', '/')
	})
})
