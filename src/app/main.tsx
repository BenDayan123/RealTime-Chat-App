"use client";

import { Varela_Round, Inter } from "next/font/google";
import { useDarkMode } from "@hooks/useDarkMode";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const varela_font = Varela_Round({
  subsets: ["hebrew"],
  weight: ["400"],
  display: "swap",
});

const inter_font = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function App({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useDarkMode(true);
  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    pathname === "/" && router.replace("/app/friends");
  }, [pathname]);

  return (
    <html
      lang="en"
      className={`${inter_font.className} ${varela_font.className} ${
        isDarkMode ? "dark" : "light"
      }`}
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
