import { signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { MdNotificationsNone as NotificationsIcon, MdOutlineSearch as SearchIcon } from 'react-icons/md'

import { routes } from "~/constants/routes"

import { PageContainer } from "./PageContainer"

interface DashboardLayoutProps {
    children: JSX.Element | JSX.Element[]
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.replace(routes.auth.signIn)
    }

    return (
        <PageContainer title="Inicio: Propietario">
            <div className="grid grid-cols-[300px_1fr] min-h-screen bg-slate-100">
                <aside className="bg-white">

                </aside>

                <div>
                    <header>
                        <div className="navbar py-6 px-8 flex justify-between items-end bg-slate-100">
                            <div className="flex-grow-0 text-3xl font-semibold">Hola, Alfredo Arvelaez</div>

                            <div className="flex-grow-1">
                                <div className="flex gap-4">
                                    <button className="w-12 btn btn-circle bg-white">
                                        <SearchIcon size={20} />
                                    </button>

                                    <button className="w-12 btn btn-circle bg-white">
                                        <NotificationsIcon size={20} />
                                    </button>
                                </div>

                                <div className="divider divider-horizontal" />

                                <button className="btn btn-circle bg-white w-12 text-lg" onClick={handleSignOut}>
                                    {/* TODO: should show user avatar's icon */}
                                    AA
                                </button>
                            </div>

                        </div>
                    </header>

                    {/* DASHBOARD */}
                    <div className="flex-grow p-6">
                        {children}
                    </div>

                </div>




            </div>
        </PageContainer>
    )
}