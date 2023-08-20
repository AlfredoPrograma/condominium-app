import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { DashboardLayout } from "~/components/common/layouts";
import { WithUser, verifySession } from "~/utils/auth/session";

import { ADMIN_QUICK_ACTIONS } from "~/constants/dashboards/quickActions";
import { QuickAction } from "~/components/common/navigation/QuickAction";
import { api } from "~/utils/api";

interface AdminLayoutProps extends WithUser {
}

export default function AdminLayout({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { data } = api.owners.getAll.useQuery()

    return (
        <DashboardLayout>
            <section className="bg-white rounded-xl shadow-sm p-8 flex flex-col gap-4">
                <header>
                    <h2 className="text-3xl font-bold">Acciones rápidas</h2>
                </header>

                <div className="grid gap-8 xl:grid-cols-3">
                    {ADMIN_QUICK_ACTIONS.map(action => <QuickAction key={action.id} {...action} />)}
                </div>
            </section>
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