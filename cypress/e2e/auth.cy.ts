describe('Login', () => {
	beforeEach(() => {
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

	// TODO: test linking between create account and log in pages
	// TODO: test remember me checkbox
})

describe('Create Account', () => {
	beforeEach(() => {
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

		cy.location('pathname').should('eq', '/dashboard')
	})
})
