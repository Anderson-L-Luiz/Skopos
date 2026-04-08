import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import bcryptjs from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    // OAuth providers — only enabled if env vars are set
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    ...(process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET
      ? [
          TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
            version: "2.0",
          }),
        ]
      : []),

    // Email/password login
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcryptjs.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers: create or link user + account in DB
      if (account && account.provider !== "credentials") {
        const email = user.email;
        if (!email) return false;

        let dbUser = await prisma.user.findUnique({ where: { email } });

        if (!dbUser) {
          // Create new user from OAuth
          dbUser = await prisma.user.create({
            data: {
              email,
              name: user.name || null,
              image: user.image || null,
              password: "", // No password for OAuth users
              profile: { create: { skills: "[]" } },
            },
          });
        } else {
          // Update image if provided by OAuth
          if (user.image && !dbUser.image) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { image: user.image },
            });
          }
        }

        // Upsert the Account record
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          create: {
            userId: dbUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state as string | null,
          },
          update: {
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
          },
        });

        // Override user.id to use our DB user ID
        user.id = dbUser.id;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
        if (token.image) {
          (session.user as { image?: string }).image = token.image as string;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
