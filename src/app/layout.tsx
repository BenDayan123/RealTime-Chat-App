import { getServerSession } from "next-auth";
import NextAuthProvider from "./auth-provider";
import MainApp from "./main";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { EdgeStoreProvider } from "@lib/store";
import "./globals.scss";

export const metadata = {
  title: "Chat App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <NextAuthProvider session={session}>
      <EdgeStoreProvider>
        <MainApp>{children}</MainApp>
      </EdgeStoreProvider>
    </NextAuthProvider>
  );
}
