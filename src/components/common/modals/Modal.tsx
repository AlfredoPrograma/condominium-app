import { MdClose as CloseIcon } from 'react-icons/md'

export interface ModalProps {
    id: string,
    title?: string,
    content?: string
    children?: JSX.Element | JSX.Element[]
}

export function Modal({ id, title, content, children }: ModalProps) {
    return (
        <>
            <input type="checkbox" id={id} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <header className='flex justify-between items-center'>
                        <h3 className="font-bold text-lg">{title}</h3>

                        <label htmlFor={id} className='btn btn-circle btn-ghost'>
                            <CloseIcon size={24} />
                        </label>
                    </header>

                    {children}
                    {content && !children && <p>{content}</p>}
                </div>

                <label className="modal-backdrop" htmlFor={id} />
            </div>
        </>
    )
}