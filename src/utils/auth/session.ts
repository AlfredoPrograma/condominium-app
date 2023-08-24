import {  type GetServerSidePropsContext, type GetServerSidePropsResult } from "next";
import { type Session } from "next-auth";
import { getSession } from "next-auth/react";
import { getDashboardRouteByRole, routes } from "~/constants/routes";

export interface WithUser {
    user: Session["user"]
}

type SessionCallback<T> = ({ session }: { session: Session }) => GetServerSidePropsResult<T>

export async function verifySession<T>(ctx: GetServerSidePropsContext, callback: SessionCallback<T>) {
    const session = await getSession(ctx)

    // Redirect to login when does not exist active session
    if (!session) {
        return {
            redirect: {
                destination: routes.auth.signIn,
                permanent: false
            }
        }
    }

    // Handle redirecting to allowed dashboard based on role and given url
    const targetUrl = ctx.resolvedUrl
    const roleUrl =  getDashboardRouteByRole(session.user.role)

    if (targetUrl !== roleUrl) {
        return {
            redirect: {
                destination: roleUrl,
                permanent: false
            }
        }
    }

    return callback({ session })
}