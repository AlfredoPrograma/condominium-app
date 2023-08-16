import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "~/server/db";
import { validatePassword } from "~/utils/encrypt/hashPassword";
import { signInSchema } from "~/utils/validations/auth";

type UserRole = "OWNER" | "ADMIN"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {

  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
    };
  }

  interface User {
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole
  } 
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 15 * 24 * 30 * 60
  },
  pages: {
    signIn: '/auth/sign-in',
    newUser: '/sign-up'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { type: "text" },
        password: { type: "password" }
      },

      async authorize(credentials) {
        const { email, password } = await signInSchema.parseAsync(credentials)

        const user = await prisma.user.findFirst({
          where: { email }
        })

        if (!user) {
          return null
        }

        if (await validatePassword(password, user.password)) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role
      }

      return token
    },

    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role
      }

      return session
    }
  }

};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
