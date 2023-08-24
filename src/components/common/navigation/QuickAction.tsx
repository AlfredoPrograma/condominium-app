import { twMerge } from "tailwind-merge"

export interface QuickActionProps {
    id: string
    title: string,
    description: string,
    icon: JSX.Element,
    modal: JSX.Element
    color: string
}

export function QuickAction({ id, title, description, icon, modal, color }: QuickActionProps) {
    return (
        <>
            <label htmlFor={id} className={twMerge("card text-white shadow-md cursor-pointer transition-all select-none hover:brightness-90", color)}>
                <div className="p-6 grid grid-cols-[60px_1fr] gap-4">
                    <div className="self-center">
                        {icon}
                    </div>

                    <div>
                        <h2 className="card-title">{title}</h2>
                        <p>{description}</p>
                    </div>
                </div>
            </label>

            {modal}
        </>
    )
}