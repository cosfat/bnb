import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/app/lib/prisma";

export const { auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || "gizli-anahtar-buraya",
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const worker = await prisma.worker.findFirst({
            where: {
              name: credentials.username
            }
          });

          if (!worker || worker.password !== credentials.password) {
            return null;
          }

          return {
            id: worker.id.toString(),
            name: worker.name,
            isAdmin: worker.isAdmin
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          ...token.user,
          isAdmin: token.user.isAdmin || false
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          ...user,
          isAdmin: user.isAdmin || false
        };
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
}); 