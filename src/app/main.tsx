"use client";

import { Varela_Round, Nunito } from "next/font/google";
import { useDarkMode } from "@hooks/useDarkMode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const varela_font = Varela_Round({
  subsets: ["hebrew"],
  weight: ["400"],
});

const nunito_font = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function App({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useDarkMode(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    pathname === "/" && router.replace("/app");
  }, [router, pathname]);

  return (
    <html
      lang="en"
      className={`${varela_font.className} ${isDarkMode ? "dark" : "light"}`}
    >
      <body
        suppressHydrationWarning={true}
        suppressContentEditableWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
