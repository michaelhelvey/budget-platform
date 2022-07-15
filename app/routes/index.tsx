import { Link } from '@remix-run/react'

export default function Index() {
	return (
		<>
			<section className="flex flex-col items-center justify-center py-24 text-center">
				<div className="flex max-w-4xl flex-col items-center px-4">
					<h2 className="font-display text-5xl font-medium tracking-tight md:text-7xl">
						An <span className="text-blue-600">open source</span> personal
						budgeting platform
					</h2>
					<p className="mt-8 max-w-lg text-lg">
						Easily track variable expenses using a simple, web-based,
						mobile-friendly application. Host it yourself, or create an account
						here.
					</p>
				</div>
				<Link
					to="/register"
					className="mt-6 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 hover:text-slate-100 active:bg-blue-800"
				>
					Get Started
				</Link>
			</section>
			<section className="flex flex-col items-center bg-blue-600 bg-gradient-to-bl px-8 py-24 text-white">
				<div className="w-full max-w-6xl">
					<h2 className="text-center text-5xl font-medium">Lorem Ipsum</h2>
					<p className="mt-8 text-center text-2xl">
						Riveting subtext that explains the above in an even better way!
					</p>
					<div className="mt-12 grid w-full grid-cols-1 gap-10 md:grid-cols-2">
						<div>
							<p>
								Totally open source. If you love writing Javascript and
								debugging difficult to understand errors without any customer
								support, you'll love this application.
							</p>
							<p className="mt-3">
								Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque
								fugit omnis delectus maxime ullam corporis beatae, corrupti
								voluptates eos ea consequatur minus ratione quod dolorem
								blanditiis ad, qui, reprehenderit soluta.
							</p>
						</div>
						<div>
							<img src="/images/github_repo_screenshot.png" />
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
