import "react-toastify/dist/ReactToastify.css";

import Head from "next/head"
import { ToastContainer } from "react-toastify"

interface PageContainerProps {
    title: string,
    children: JSX.Element | JSX.Element[]
}

export function PageContainer({ title, children }: PageContainerProps) {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <main className="min-h-screen">
                {children}

                <ToastContainer autoClose={5000} />
            </main>
        </>
    )
}