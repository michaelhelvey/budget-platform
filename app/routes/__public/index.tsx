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
			<section className="flex flex-col items-center bg-slate-100 bg-gradient-to-bl px-8 py-24 text-slate-900">
				<div className="w-full max-w-6xl">
					<h2 className="text-center text-5xl font-medium">How It Works</h2>
					<p className="mt-8 text-center text-2xl">
						Reduce friction on recording transactions for common expenses
					</p>
					<div className="mt-12 grid w-full grid-cols-1 gap-10 md:grid-cols-2">
						<div>
							<p className="leading-relaxed">
								SimpleBudget isn't meant to be a replacement for Excel or your
								favorite budgeting application. It's designed to lower the
								friction of entering transactions for those common expenses that
								you have every day -- utility bills, grocery, gas, etc. Use
								SimpleBudget to track those expenses, then export in a variety
								of formats to use however you like.
							</p>
							<p className="mt-4 leading-relaxed">
								SimpleBudget is an open source application designed to be
								deployed on your own (though you're welcome to create an account
								here to try it out). The project README includes detailed
								instructions on how to deploy the project to{' '}
								<a
									className="text-blue-700 underline visited:text-slate-700"
									href="https://fly.io"
								>
									Fly
								</a>
								, a popular cloud computing platform, and also includes a
								Dockerfile for easy deployment wherever you like. Data is stored
								in a local sqlite database for easy backups and manipulation.
							</p>
							<p className="mt-4 leading-relaxed">
								If you want to add new features, you'll find a clean,
								well-tested codebase readily available{' '}
								<a
									href="https://github.com/michaelhelvey/budget-platform"
									className="text-blue-700 underline visited:text-slate-700"
								>
									on Github.
								</a>
							</p>
						</div>
						<div>
							<img
								src="/images/github_repo_screenshot.png"
								alt="Screenshot of SimpleBudget Github repository"
							/>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
