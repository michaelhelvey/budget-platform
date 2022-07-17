import { Outlet } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { DashboardNavigation } from '~/components/dashboard/DashboardNavigation'
import { SiteFooter } from '~/components/shell/SiteFooter'
import { requireUser } from '~/lib/session.server'

export const loader: LoaderFunction = async ({ request }) => {
	await requireUser(request)
	return null
}

export default function Dashboard() {
	return (
		<>
			<DashboardNavigation />
			<div className="flex-1 bg-slate-100">
				<Outlet />
			</div>
			<SiteFooter />
		</>
	)
}
