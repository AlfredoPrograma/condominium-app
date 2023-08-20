import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { MdClose as CloseIcon } from 'react-icons/md'
import { twMerge } from 'tailwind-merge'

export interface ModalProps {
    id: string,
    isOpen?: boolean,
    setIsOpen?: Dispatch<SetStateAction<boolean>>
    title?: string,
    children?: JSX.Element | JSX.Element[]
    onClose?: () => void
    width?: string
}

export function Modal({ id, title, isOpen, width, setIsOpen, onClose, children }: ModalProps) {
    const handleClose = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isOpen) {
            onClose?.()
        }

        setIsOpen?.(event.target.checked)
    }

    return (
        <>
            <input onChange={handleClose} type="checkbox" id={id} className="modal-toggle" checked={isOpen} />
            <div className="modal">
                <div className={twMerge('modal-box', width)}>
                    <header className='flex justify-between items-center'>
                        <h3 className="font-bold text-lg">{title}</h3>

                        <label htmlFor={id} className='btn btn-circle btn-ghost'>
                            <CloseIcon size={24} />
                        </label>
                    </header>

                    {children}
                </div>

                <label className="modal-backdrop" htmlFor={id} />
            </div>
        </>
    )
}