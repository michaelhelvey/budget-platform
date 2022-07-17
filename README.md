# SimpleBudget

![CI Status](https://github.com/michaelhelvey/budget-platform/actions/workflows/deploy.yml/badge.svg)

A simple, open source budget application for me and my family, built with the [Remix framework](https://remix.run) and other tools [described below](#stack). You're welcome to fork it and deploy it yourself if you like, and even contribute features, but it's really just intended for my own personal use.

## Quickstart

```shell
$ git clone https://github.com/michaelhelvey/budget-platform
$ cd budget-platform
$ npm install
$ npm run dev
```

The application will be running locally on `http://localhost:3000`. You can customize the port using the `$PORT` environment variable.

## Stack

_Shoutout to the [Remix Indie Stack](https://github.com/remix-run/indie-stack)
for bootstrapping this project!_

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [SQLite Database](https://sqlite.org)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Deployment

This is app is installed on my personal [Fly](https://fly.io) account. To install it on your own, you can do the following (steps mostly taken from the [Indie stack](https://github.com/remix-run/indie-stack) deployment docs)

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly create <your app name>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo (presumably the one you forked this repo into). To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app <your app name>
  ```

  If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

  ```sh
  fly volumes create data --size 1 --app <your app name>
  ```

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `master` branch will trigger a deployment to your Fly application.

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login()
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
	cy.cleanupUser()
})
```

That way, we can keep your local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.

## Documentation

Following is some notes and documentation related to how the software is intended to function.

### User accounts

When a user signs up, if they are not signing up in response to a invitation,
then a new "Organization" will be created. Organizations contain users. If a
user sends an invitation to another user, and that user creates an account, they
will be automatically added to the organization to which they were invited.

If a user signs up and there is no organization associated with that user, then
they will be taken to a secondary screen after signing up where they can invite
other users they want to share their account with.

Budget settings and transactions are child objects of organizations. Any user
in an organization can edit anything that any other user can -- at the moment,
there is no such thing as "roles" -- invite users whom you trust.

There is no email validation or transaction email set up. Therefore, you
_could_ abuse the system by inviting a user to your own "dummy" organization,
thus preventing them from subsequently creating an account with the email you
sent the invitation to. However, since this software is intended to be deployed
separately for each organization that wants to use it (in general), I don't
think this will be an issue in practice.

Obviously if I ever turn this into a proper SaaS model, then we'll need
transactional email and proper roles and security, etc.

## License

[APGL 3.0](./LICENSE)
