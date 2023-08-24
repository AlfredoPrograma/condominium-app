import { type HTMLProps } from "react";
import { useFormContext } from "react-hook-form";

interface TextField extends HTMLProps<HTMLInputElement> {
    id: string
    name: string
    label?: string,
    placeholder?: string
}

export function TextField({ label, type, id, name, placeholder, ...props }: TextField) {
    const { register, formState: { errors } } = useFormContext()

    return (
        <div className="form-control w-full">
            {label && (
                <label htmlFor={id} className="label">
                    <span className="label-text font-semibold">{label}</span>
                </label>
            )}

            <input
                autoComplete="off"
                type={type}
                id={id}
                className="input input-bordered w-full"
                placeholder={placeholder}
                {...props}
                {...register(name)}
            />

            {
                errors[name] && (
                    <div className="label">
                        {<span className="label-text-alt text-error">{errors[name]?.message as string}</span>}
                    </div>
                )
            }
        </div>
    )
}