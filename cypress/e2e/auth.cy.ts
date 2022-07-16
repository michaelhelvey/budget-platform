describe('smoke tests', () => {
	afterEach(() => {
		cy.cleanupUser()
	})

	it('auth: login', () => {
		const loginForm = {
			email: 'michael@example.com',
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

		cy.findByRole('heading')
			.invoke('text')
			.should('match', /welcome to your dashboard/i)
	})
})
