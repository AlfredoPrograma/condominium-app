import {  GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { getDashboardRouteByRole, routes } from "~/constants/routes";

export interface WithUser {
    user: Session['user']
}

type SessionCallback<T> = ({ session }: { session: Session }) => GetServerSidePropsResult<T>

export async function verifySession<T>(ctx: GetServerSidePropsContext, callback: SessionCallback<T>) {
    const session = await getSession(ctx)

    if (!session) {
        return {
            redirect: {
                destination: routes.auth.signIn,
                permanent: false
            }
        }
    }

    return callback({ session })
}