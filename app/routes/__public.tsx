import { Outlet } from '@remix-run/react'
import { SiteNavigation } from '~/components/shell/Navigation'
import { SiteFooter } from '~/components/shell/SiteFooter'

export default function PublicPageWrapper() {
	return (
		<main className="flex h-full flex-col bg-white">
			<SiteNavigation />
			<div className="flex-1">
				<Outlet />
			</div>
			<SiteFooter />
		</main>
	)
}
