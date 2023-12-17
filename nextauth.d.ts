import { DefaultSession, DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  id?: string;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH0_SECRET: string;
      AUTH0_ISSUER_BASE_URL: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_CLIENT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      NEXTAUTH_SECRET: string;
      FACEBOOK_CLIENT_ID: string;
      FACEBOOK_CLIENT_SECRET: string;
      TWITTER_CLIENT_ID: string;
      TWITTER_CLIENT_SECRET: string;
      PUSHER_APP_ID: string;
      PUSHER_CLIENT_KEY: string;
      PUSHER_SECERT: string;
      PUSHER_CLUSTER: string;
    }
  }
}
