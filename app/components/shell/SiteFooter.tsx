import { Link } from '@remix-run/react'
import { LogoIcon } from '../icons/Logo'

const mainNavLinkStyles =
	'rounded px-3 py-2 text-sm text-gray-700 hover:bg-slate-100'

const rickRoll = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

export function SiteFooter({
	showNavigation = false,
}: {
	showNavigation?: boolean
}) {
	return (
		<footer className="w-full">
			{showNavigation ? (
				<div className="flex flex-col items-center justify-center py-12">
					<div className="flex items-center">
						<div className="h-8 w-8">
							<LogoIcon className="text-blue-600" />
						</div>
						<h1 className="ml-3 text-lg font-bold text-slate-900">
							Simple<span className="text-blue-600">Budget</span>
						</h1>
					</div>

					<div className="mt-6 flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-6">
						<Link to="/about" className={mainNavLinkStyles}>
							About
						</Link>
						<a href={rickRoll} className={mainNavLinkStyles}>
							Testimonials
						</a>
						<a href={rickRoll} className={mainNavLinkStyles}>
							Blog
						</a>
					</div>
				</div>
			) : null}
			<div className="flex items-center justify-between border-t border-slate-100 py-6 px-6 text-sm text-slate-600">
				<p>Built by Michael Helvey. (?TODO) MPL Licensed (?TODO)</p>
				<div>
					<a
						href="https://github.com/michaelhelvey/budget-platform"
						className={mainNavLinkStyles}
					>
						Github
					</a>
					<a
						href="https://trello.com/b/Ixw9MIHh/simplebudget-engineering"
						className={mainNavLinkStyles}
					>
						Trello
					</a>
				</div>
			</div>
		</footer>
	)
}
