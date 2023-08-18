import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { DashboardLayout } from "~/components/common/layouts/DashboardLayout";
import { WithUser, verifySession } from "~/utils/auth/session";

interface AdminLayoutProps extends WithUser { }

export default function AdminLayout({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <DashboardLayout>
            <h1>Dashboard</h1>
        </DashboardLayout>
    )
}

export const getServerSideProps: GetServerSideProps<AdminLayoutProps> = async (ctx) => {
    return await verifySession(ctx, ({ session }) => {
        return {
            props: {
                user: session.user,
            }
        }
    })
}