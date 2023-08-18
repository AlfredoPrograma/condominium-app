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

export const dashboardsByRole: Record<Role, string> = {
    ADMIN: routes.admin.dashboard,
    OWNER: routes.owner.dashboard
}


export function getDashboardRouteByRole(role: Role) {
    return dashboardsByRole[role]
}