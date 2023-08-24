import { NavigationLink, type NavigationLinkProps } from "~/components/common/navigation/NavigationLink"
import { MdOutlineKeyboardArrowDown as ChevronDownIcon } from "react-icons/md"

interface AsideNavigationProps {
    links: NavigationLinkProps[]
}

export function AsideNavigation({ links }: AsideNavigationProps) {
    return (
        <aside className="flex flex-col gap-6 bg-white py-6 px-8">
            <header>
                <h1 className="text-xl font-semibold">Condominium</h1>
            </header>

            <button className="btn btn-square w-full flex justify-between gap-2 px-6 py-8 flex-nowrap ">
                {/* TODO: Current residency */}
                <span>Mirador de Montserrat</span>
                <ChevronDownIcon size={32} />
            </button>

            <nav>
                <ul>
                    {links.map(navigation => <NavigationLink key={navigation.href} {...navigation} />)}
                </ul>
            </nav>
        </aside>
    )
}