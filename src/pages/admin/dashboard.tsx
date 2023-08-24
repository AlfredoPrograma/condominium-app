import { type GetServerSideProps, type InferGetServerSidePropsType } from "next";
import { DashboardLayout } from "~/components/common/layouts";
import { type WithUser, verifySession } from "~/utils/auth/session";
import { ADMIN_QUICK_ACTIONS } from "~/constants/dashboards/quickActions";
import { QuickAction } from "~/components/common/navigation/QuickAction";
import { api } from "~/utils/api";
import { OwnersTable } from "~/components/admin/tables/OwnersTable";

type AdminLayoutProps = WithUser

export default function AdminLayout({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { data } = api.owners.getAll.useQuery()

    return (
        <DashboardLayout>
            <div className="grid grid-cols-6 gap-8">
                <section className="bg-white rounded-xl shadow-sm p-8 flex flex-col gap-4 col-span-6">
                    <header>
                        <h2 className="text-3xl font-bold">Acciones rápidas</h2>
                    </header>

                    <div className="grid gap-8 xl:grid-cols-3">
                        {ADMIN_QUICK_ACTIONS.map(action => <QuickAction key={action.id} {...action} />)}
                    </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm p-8 flex flex-col gap-4 col-span-4">
                    <header>
                        <h2 className="text-3xl font-bold">Lista de propietarios</h2>
                    </header>

                    <div>
                        <OwnersTable owners={data?.owners ?? []} />
                    </div>
                </section>
            </div>
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