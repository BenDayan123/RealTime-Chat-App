import { Providers } from "@hooks/index";
import SideBar from "@components/sidebar";
import "./style.scss";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="application">
        <SideBar />
        <div
          id="main-window"
          className="h-full bg-background-light dark:bg-background-dark"
        >
          {children}
        </div>
      </main>
    </Providers>
  );
}
