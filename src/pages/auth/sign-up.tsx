import { ChangeEvent, FormEvent, useState } from "react";
import { api } from "~/utils/api";

export default function SignUp() {
    const [signUpForm, setSignUpForm] = useState({
        email: '',
        password: ''
    })
    const { mutate: dispatchLogin } = api.auth.signUp.useMutation({
        onSuccess: (data) => console.log(data),
        onError: (e) => {
            console.log("Catched error")
            console.log(e)
        }
    })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatchLogin(signUpForm)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setSignUpForm({...signUpForm, [name]: value })
    }

    return (
        <form className="card" onSubmit={(e) => handleSubmit(e)}>
            <input type="text" className="input input-bordered w-full max-w-xs" name="email" onChange={handleChange} value={signUpForm.email} />
            <input type="password" className="input input-bordered w-full max-w-xs" name="password" onChange={handleChange} value={signUpForm.password} />

            <button type="submit" className="btn-primary">Log in</button>
        </form>
    )
}