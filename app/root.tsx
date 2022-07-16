import type {
	LinksFunction,
	LoaderFunction,
	MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import {
	Link,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
} from '@remix-run/react'
import { SiteNavigation } from './components/shell/Navigation'
import { SiteFooter } from './components/shell/SiteFooter'

import { getUser } from './lib/session.server'
import tailwindStylesheetUrl from './styles/tailwind.css'

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: tailwindStylesheetUrl }]
}

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'SimpleBudget',
	viewport: 'width=device-width,initial-scale=1',
})

type LoaderData = {
	user: Awaited<ReturnType<typeof getUser>>
}

export const loader: LoaderFunction = async ({ request }) => {
	return json<LoaderData>({
		user: await getUser(request),
	})
}

export default function App() {
	return (
		<html lang="en" className="h-full">
			<head>
				<Meta />
				<Links />
			</head>
			<body className="h-full">
				<main className="flex h-full flex-col bg-white">
					<SiteNavigation />
					<div className="flex-1">
						<Outlet />
					</div>
					<SiteFooter />
				</main>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}

export function CatchBoundary() {
	const caught = useCatch()

	return (
		<html lang="en" className="h-full">
			<head>
				<Meta />
				<Links />
			</head>
			<body className="h-full">
				<main className="flex h-full flex-col items-center bg-white">
					<SiteNavigation />
					<div className="flex w-full max-w-4xl flex-1 flex-col py-6 px-6">
						{caught.status === 404 ? <NotFoundPage /> : <GenericCatchPage />}
					</div>
					<SiteFooter />
				</main>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}

function NotFoundPage() {
	return (
		<div className="flex flex-col items-baseline">
			<h1 className="text-2xl font-semibold">Page Not Found</h1>
			<Link
				to="/"
				className="mt-4 rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
			>
				Go Home
			</Link>
		</div>
	)
}

function GenericCatchPage() {
	const caught = useCatch()

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-semibold text-red-700">
				An unknown error has occurred.
			</h1>
			<p className="font-bold text-slate-800">Status: {caught.status}</p>
			<div>
				<span className="text-sm font-semibold text-slate-800">
					Caught data:
				</span>
				<pre className="mt-2 rounded bg-slate-100 p-3 text-sm">
					<code>{JSON.stringify(caught.data, null, 2)}</code>
				</pre>
			</div>
		</div>
	)
}
