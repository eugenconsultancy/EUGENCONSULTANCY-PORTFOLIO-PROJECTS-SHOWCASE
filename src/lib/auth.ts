import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const admin = await db.admin.findUnique({
                    where: { email: credentials.email },
                });

                if (!admin) {
                    return null;
                }

                const isValid = await compare(credentials.password, admin.passwordHash);

                if (!isValid) {
                    return null;
                }

                return {
                    id: admin.id.toString(),
                    email: admin.email,
                    name: admin.name || admin.email,
                };
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};