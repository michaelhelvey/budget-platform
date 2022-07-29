describe('Create Account', () => {
	before(() => {
		cy.cleanUpDatabase()
	})

	it('a user can create an account and be onboarded', () => {
		cy.visit('/')
		cy.findByRole('link', { name: /create account/i }).click()

		const $firstName = () => cy.findByRole('textbox', { name: /first name/i })
		const $lastName = () => cy.findByRole('textbox', { name: /last name/i })
		const $email = () => cy.findByRole('textbox', { name: /email/i })
		const $password = () => cy.findByLabelText(/^password$/i)
		const $confirmPassword = () => cy.findByLabelText(/^confirm password$/i)

		const $createAccountBtn = () =>
			cy.findByRole('button', { name: /create account/i })

		const typeForm = (request: any) => {
			$firstName().type(request.firstName)
			$lastName().type(request.lastName)
			$email().type(request.email)
			$password().type(request.password)
			$confirmPassword().type(request.confirmPassword)
		}

		const clearForm = () => {
			$firstName().clear()
			$lastName().clear()
			$email().clear()
			$password().clear()
			$confirmPassword().clear()
		}

		// when the user types in something wrong, we should get a validation error
		typeForm({
			firstName: 'Rupert',
			lastName: 'TestUser',
			email: 'rupert@testuser.com',
			password: 'asdf1234',
			confirmPassword: 'not equal to the other one at all',
		})
		$createAccountBtn().click()

		cy.findByText(/passwords do not match/i)

		// when the user types in correct entries, they should be logged in and sent
		// to their dashboard page
		// TODO: eventually they will have more an onboarding flow, but MVP for now.
		clearForm()
		typeForm({
			firstName: 'Rupert',
			lastName: 'TestUser',
			email: 'rupert@testuser.com',
			password: 'asdf1234',
			confirmPassword: 'asdf1234',
		})
		$createAccountBtn().click()

		cy.location('pathname').should('eq', '/register/invite-users')
	})
})
