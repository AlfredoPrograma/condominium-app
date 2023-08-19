import Link from "next/link";

export interface NavigationLinkProps {
    icon: JSX.Element,
    text: string
    href: string
}

export function NavigationLink({ text, icon, href }: NavigationLinkProps) {
    return (
        <li key={href}>
            <Link href={href} className="flex items-center gap-4 px-4 py-5 rounded-md transition-all hover:bg-slate-100">
                {icon}
                <span>{text}</span>
            </Link>
        </li>
    )
}