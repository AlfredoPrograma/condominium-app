export interface ModalProps {
    id: string,
}

export function Modal({ id }: ModalProps) {
    return (
        <>
            <input type="checkbox" id={id} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">This modal works with a hidden checkbox!</p>

                    <div className="modal-action">
                        <label htmlFor={id} className="btn">Close!</label>
                    </div>
                </div>
            </div>
        </>
    )
}