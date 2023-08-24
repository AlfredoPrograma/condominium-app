import { type GetServerSideProps, type InferGetServerSidePropsType } from "next";
import { type WithUser, verifySession } from "~/utils/auth/session";
import { DashboardLayout } from "~/components/common/layouts";

type OwnerDashboardProps = WithUser

export default function OwnerDashboard({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <DashboardLayout>
            <h1>Dashboard</h1>
        </DashboardLayout>
    )
}

export const getServerSideProps: GetServerSideProps<OwnerDashboardProps> = async (ctx) => {
    return await verifySession(ctx, ({ session }) => {
        return {
            props: {
                user: session.user
            }
        }
    })
}