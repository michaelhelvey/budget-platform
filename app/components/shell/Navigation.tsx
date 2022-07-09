import { Link } from '@remix-run/react'
import { useState } from 'react'
import { LogoIcon } from '../icons/Logo'
import { MenuIcon } from '../icons/Menu'
import { TimesIcon } from '../icons/Times'

const mainNavLinkStyles =
	'rounded px-3 py-2 text-sm text-gray-700 hover:bg-slate-100'

const mobileNavLinkStyles = 'my-2'

type PropTypes<T extends React.ExoticComponent<any> | React.Component<any>> =
	T extends React.ExoticComponent<infer P> | React.Component<infer P>
		? P
		: never

type NavigationLinksSpec = {
	[key in 'main' | 'account']: Array<
		PropTypes<typeof Link> & {
			text: string
			styles: { mobile: string; desktop: string }
		}
	>
}

const navigationLinks: NavigationLinksSpec = {
	main: [
		{
			to: '/',
			styles: { desktop: mainNavLinkStyles, mobile: mobileNavLinkStyles },
			text: 'About',
		},
	],
	account: [
		{
			to: '/login',
			styles: { desktop: mainNavLinkStyles, mobile: mobileNavLinkStyles },
			text: 'Log In',
		},
		{
			to: '/register',
			styles: {
				desktop:
					'rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 hover:text-slate-100 active:bg-blue-800 md:text-sm',
				mobile: mobileNavLinkStyles,
			},
			text: 'Create Account',
		},
	],
}

export function SiteNavigation() {
	const [showMenu, setMenuShowing] = useState(false)

	return (
		<nav className="relative flex w-full items-center justify-center py-8">
			<div className="flex w-full max-w-6xl items-center justify-between">
				<ul id="left-nav-container" className="flex items-center space-x-6">
					<li>
						<Link to="/" className="flex items-center">
							<div className="h-8 w-8">
								<LogoIcon className="text-blue-600" />
							</div>
							<h1 className="ml-3 text-lg font-bold text-slate-900">
								Simple<span className="text-blue-600">Budget</span>
							</h1>
						</Link>
					</li>
					{navigationLinks.main.map((link) => (
						<li className="hidden md:block" key={link.to.toString()}>
							<Link to={link.to} className={link.styles.desktop}>
								{link.text}
							</Link>
						</li>
					))}
				</ul>

				<ul className="hidden items-center space-x-4 md:flex">
					{navigationLinks.account.map((link) => (
						<li key={link.to.toString()}>
							<Link
								to={link.to}
								className={link.styles.desktop}
								key={link.to.toString()}
							>
								{link.text}
							</Link>
						</li>
					))}
				</ul>

				<div className="mr-4 md:hidden">
					<button
						onClick={() => setMenuShowing((x) => !x)}
						className="relative z-10"
						aria-expanded={showMenu}
						aria-label="Toggle Navigation"
					>
						{showMenu ? <TimesIcon /> : <MenuIcon />}
					</button>
					{showMenu ? (
						<div>
							<div className="fixed inset-0 bg-slate-300/50" />
							<div className="absolute inset-x-0 mt-4 flex flex-col rounded-xl bg-white p-4 shadow-xl ring-1 ring-slate-500/5">
								{navigationLinks.main.map((link) => (
									<Link
										to={link.to}
										className={link.styles.mobile}
										key={link.to.toString()}
									>
										{link.text}
									</Link>
								))}
								<div className="my-2 border-t-2 border-slate-100" />
								{navigationLinks.account.map((link) => (
									<Link
										to={link.to}
										className={link.styles.mobile}
										key={link.to.toString()}
									>
										{link.text}
									</Link>
								))}
							</div>
						</div>
					) : null}
				</div>
			</div>
		</nav>
	)
}
