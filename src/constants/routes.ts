import { Role } from "@prisma/client";

export const routes = {
    auth: {
        signIn: "/auth/sign-in",
        signUp: "/auth/sign-up"
    },
    owner: {
        dashboard: '/owner/dashboard'
    },
    admin: {
        dashboard: '/admin/dashboard'
    }
}

export function getDashboardRouteByRole(role: Role) {
    const dashboards: Record<Role, string> = {
        ADMIN: routes.admin.dashboard,
        OWNER: routes.owner.dashboard
    }

    return dashboards[role]
}