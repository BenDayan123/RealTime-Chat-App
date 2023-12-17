import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";

const { NEXTAUTH_SECRET, SALT_ROUNDS = 10 } = process.env;
const salt = bcrypt.genSaltSync(+SALT_ROUNDS);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "signin",
    newUser: "/app/friends",
  },
  adapter: PrismaAdapter(prisma as any) as any,
  providers: [
    CredentialsProvider({
      id: "login",
      type: "credentials",
      name: "login",

      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (
          user?.password &&
          !(await bcrypt.compare(password, user.password))
        ) {
          throw new Error(
            JSON.stringify({
              errors: "Password is not currect",
            }),
          );
        }
        return user;
      },
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
    }),
    CredentialsProvider({
      id: "sign-up",
      type: "credentials",
      name: "Sign up",

      async authorize(credentials) {
        const { email, password, username, profile } = credentials ?? {};
        if (!email || !password || !username || !profile) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          if (user.name === username)
            throw "There already user with that username";
          throw "There already user with that email";
        }
        return await prisma.user.create({
          data: {
            email,
            password: await bcrypt.hash(password, salt),
            name: username,
            image: profile,
          },
        });
      },
      credentials: {
        profile: { label: "profile", type: "file" },
        username: { label: "Username", type: "text", placeholder: "username" },
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // if(trigger === "update"){
      //   return { ...token, ...session };
      // }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  jwt: {
    secret: NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

// GoogleProvider({
//   clientId: GOOGLE_CLIENT_ID,
//   clientSecret: GOOGLE_CLIENT_SECRET,
//   profile(profile) {
//     return {
//       id: profile.sub,
//       name: profile.name,
//       email: profile.email,
//       image: profile.picture.replace(/s=\d+/, "s=600"),
//     };
//   },
//   checks: ["none"],
// }),
// Auth0Provider({
//   clientId: AUTH0_CLIENT_ID,
//   clientSecret: AUTH0_CLIENT_SECRET,
//   issuer: AUTH0_ISSUER,
// }),
// FacebookProvider({
//   clientId: FACEBOOK_CLIENT_ID,
//   clientSecret: FACEBOOK_CLIENT_SECRET,
// }),
// TwitterProvider({
//   clientId: TWITTER_CLIENT_ID,
//   clientSecret: TWITTER_CLIENT_SECRET,
//   version: "2.0",
// }),
