
import { ADMIN_ASIDE_NAVIGATION } from "~/constants/dashboards/navigation"

import { PageContainer } from "../PageContainer"
import { AsideNavigation } from "./AsideNavigation"
import { Navbar } from "./Navbar"


interface DashboardLayoutProps {
    children: JSX.Element | JSX.Element[]
}

export function DashboardLayout({ children }: DashboardLayoutProps) {

    return (
        <PageContainer title="Inicio: Propietario">
            <div className="grid grid-cols-[300px_1fr] min-h-screen bg-slate-100">
                {/* TODO: Links should change based on role */}
                <AsideNavigation links={ADMIN_ASIDE_NAVIGATION} />

                <div>
                    <Navbar />
                    {/* DASHBOARD */}
                    <div className="flex-grow p-6">
                        {children}
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}