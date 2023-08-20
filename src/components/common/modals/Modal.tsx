import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { MdClose as CloseIcon } from 'react-icons/md'

export interface ModalProps {
    id: string,
    isOpen?: boolean,
    setIsOpen?: Dispatch<SetStateAction<boolean>>
    title?: string,
    children?: JSX.Element | JSX.Element[]
    onClose?: () => void
}

export function Modal({ id, title, isOpen, setIsOpen, onClose, children }: ModalProps) {

    console.log(isOpen)
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
                <div className="modal-box">
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