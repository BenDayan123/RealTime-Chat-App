import { getServerSession } from "next-auth";
import NextAuthProvider from "./auth-provider";
import MainApp from "./main";
import "./globals.scss";
import { authOptions } from "../pages/api/auth/[...nextauth]";

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
      <MainApp>{children}</MainApp>
    </NextAuthProvider>
  );
}
