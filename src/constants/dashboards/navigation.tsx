import { MdPeopleAlt as PeopleIcon, MdCalendarMonth as CalendarIcon, MdEditDocument as DocumentIcon, MdAttachMoney as MoneyIcon, MdSettings as SettingsIcon } from 'react-icons/md'
import { NavigationLinkProps } from '~/components/common/navigation/NavigationLink'

export const ADMIN_ASIDE_NAVIGATION: NavigationLinkProps[] = [
    {
        text: "Propietarios",
        href: "owners",
        icon: <PeopleIcon size={20} />
    },
    {
        text: "Reservaciones",
        href: "reservations",
        icon: <CalendarIcon size={20} />
    },
    {
        text: "Comunicados",
        href: "communiques",
        icon: <DocumentIcon size={20} />
    },
    {
        text: "Facturación",
        href: "billing",
        icon: <MoneyIcon size={20} />
    },
    {
        text: "Configuraciones",
        href: "settings",
        icon: <SettingsIcon size={20} />
    }
]