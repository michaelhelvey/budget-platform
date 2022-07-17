import { Popover } from '@headlessui/react'
import { Link } from '@remix-run/react'
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

type NavigationLinksSpec = Array<
	PropTypes<typeof Link> & {
		text: string
		styles: { mobile: string; desktop: string }
	}
>

const navigationLinks: NavigationLinksSpec = [
	{
		to: '.',
		styles: { desktop: mainNavLinkStyles, mobile: mobileNavLinkStyles },
		text: 'Dashboard',
	},
	{
		to: 'settings',
		styles: { desktop: mainNavLinkStyles, mobile: mobileNavLinkStyles },
		text: 'Settings',
	},
]

export function DashboardNavigation() {
	return (
		<nav className="relative flex w-full items-center justify-center border-b border-slate-300 py-6 px-4 shadow-sm">
			<div className="flex w-full max-w-6xl items-center justify-between">
				<ul id="left-nav-container" className="flex items-center space-x-6">
					<li>
						<Link to="/" className="flex items-center">
							<div className="h-8 w-8">
								<LogoIcon className="text-blue-600" />
							</div>
							<div className="ml-3 text-lg font-bold text-slate-900">
								Simple<span className="text-blue-600">Budget</span>
							</div>
						</Link>
					</li>
				</ul>

				<ul className="hidden items-center space-x-4 md:flex">
					{navigationLinks.map((link) => (
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
					<li>
						<Link to={'/logout'} className={mainNavLinkStyles}>
							Log Out
						</Link>
					</li>
				</ul>

				<Popover className="mr-4 md:hidden">
					{({ open }) => (
						<>
							<Popover.Button className="relative z-10">
								{open ? <TimesIcon /> : <MenuIcon />}
							</Popover.Button>
							<Popover.Panel>
								<Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
								<div className="absolute inset-x-0 mx-4 mt-4 flex flex-col rounded-xl bg-white p-4 shadow-xl ring-1 ring-slate-500/5">
									{navigationLinks.map((link) => (
										<Link
											to={link.to}
											className={link.styles.mobile}
											key={link.to.toString()}
										>
											{link.text}
										</Link>
									))}
									<div className="my-2 border-t-2 border-slate-100" />
									<Link to={'/logout'} className={mobileNavLinkStyles}>
										Logout
									</Link>
								</div>
							</Popover.Panel>
						</>
					)}
				</Popover>
			</div>
		</nav>
	)
}
