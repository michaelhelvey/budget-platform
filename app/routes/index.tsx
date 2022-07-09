import { Link } from '@remix-run/react'
import { SiteNavigation } from '~/components/shell/Navigation'

export default function Index() {
	return (
		<main className="bg-white px-6">
			<SiteNavigation />
			<section className="flex flex-col items-center justify-center py-24 text-center">
				<div className="flex max-w-3xl flex-col items-center">
					<h2 className="font-display text-5xl font-medium tracking-tight md:text-7xl">
						A <span className="text-blue-600">completely useless</span>{' '}
						marketing statement
					</h2>
					<p className="mt-6 max-w-lg text-xl">
						If you're here, you probably already want to use the thing, so idk
						what I'm writing here.
					</p>
				</div>
				<Link
					to="/register"
					className="mt-6 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 hover:text-slate-100 active:bg-blue-800"
				>
					Get Started
				</Link>
			</section>
		</main>
	)
}
