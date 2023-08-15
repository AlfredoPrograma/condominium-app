import { useSession, signIn } from "next-auth/react"
import { ChangeEvent, FormEvent, useState } from "react"

export default function SignIn() {
    const [signInForm, setSignInForm] = useState({
        email: "",
        password: ""
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const res = await signIn("credentials", { 
                callbackUrl: "/",
                email: signInForm.email,
                password: signInForm.password
            })

            console.log(res)
        } catch(err) {
            console.error(err)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setSignInForm({...signInForm, [name]: value })
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)} className="card bg-white max-w-xs p-12 flex flex-col gap-4">
            <input onChange={handleChange} value={signInForm.email} type="text" name="email"  className="input input-bordered w-full max-w-xs" />
            <input onChange={handleChange} value={signInForm.password} type="password" name="password"  className="input input-bordered w-full max-w-xs" />

            <button type="submit" className="btn-primary rounded-md py-2">Sign in</button>
        </form>
    )
}