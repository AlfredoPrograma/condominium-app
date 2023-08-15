import Head from "next/head"

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
                { children }
            </main>
        </>
    )
}