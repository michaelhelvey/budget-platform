describe('onboarding - user invitations', () => {
	before(() => {
		cy.cleanUpDatabase()
	})

	it('given a logged in user, that user can invite users', () => {
		cy.login()
		cy.visit('/register/invite-users')

		cy.findByText(/invite new users/i).should('be.visible')

		const $email = () => cy.findByRole('textbox', { name: /email/i })
		const $submit = () => cy.findByRole('button', { name: /invite.*user/i })

		const $continue = () =>
			cy.findByRole('link', { name: /continue to dashboard/i })

		$email().type('foo@bar.com')
		$submit().click()

		cy.findByText('foo@bar.com').should('be.visible')
		cy.findByText(/invitation pending/i).should('be.visible')

		$email().type('another@bar.com')
		$submit().click()

		cy.findByText('another@bar.com').should('be.visible')
		$continue().click()

		cy.location('pathname').should('eq', '/dashboard')
	})

	it('an invited user is taken shown the account they are joined to after signing up', () => {
		// see previous test -- foo@bar.com should already be invited

		// then when that user goes to create their account....
		cy.visit('/register')

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

		typeForm({
			firstName: 'Rupert',
			lastName: 'TestUser',
			email: 'foo@bar.com',
			password: 'asdf1234',
			confirmPassword: 'asdf1234',
		})
		$createAccountBtn().click()

		// instead of being invited to invite users, they should be shown their invitation
		cy.location('pathname').should('eq', '/register/view-invitation')

		cy.findByText(/you've been invited/i).should('be.visible')
	})
})
