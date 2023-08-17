import Link from "next/link"
import { PageContainer } from "./PageContainer"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { routes } from "~/constants/routes"

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
            <div className="flex flex-col min-h-screen">
                <header className="flex-grow-0">
                    <div className="navbar bg-base-100 shadow-md px-6 flex justify-between">
                        <div>
                            <Link href="#" className="font-bold text-xl">Condominium</Link>
                        </div>

                        <div>
                            <button onClick={handleSignOut} className="btn-error px-4 py-2 rounded-md">Cerrar sesión</button>
                        </div>
                    </div>
                </header>

                {/* DASHBOARD */}
                <div className="flex-grow p-6">
                    {children}
                </div>

                <footer className="footer footer-center p-4 bg-base-200 text-base-content flex-grow-0">
                    <div>
                        <p>Todos los derechos reservados © {2023} - Alfredo Arvelaez</p>
                    </div>
                </footer>

            </div>
        </PageContainer>
    )
}