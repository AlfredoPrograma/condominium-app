import { signOut } from "next-auth/react"
import { useRouter } from "next/router"

import { MdNotificationsNone as NotificationsIcon, MdOutlineSearch as SearchIcon, } from "react-icons/md"

import { routes } from "~/constants/routes"

export function Navbar() {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.replace(routes.auth.signIn)
    }

    return (
        <header>
            <div className="navbar py-6 px-8 flex justify-end bg-slate-100">
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
        </header>
    )
}