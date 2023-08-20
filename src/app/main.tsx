"use client";

import { useMemo, useState } from "react";
import { Sora } from "next/font/google";

const font = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function App({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("dark");
  const isDark = useMemo(() => theme === "dark", [theme]);
  return (
    <html lang="en" className={`${font.className} ${theme}`}>
      <body suppressHydrationWarning={true}>
        <button
          className="absolute left-0 bottom-0 z-10 m-5 cursor-pointer rounded-circle bg-surface-dark p-4 dark:bg-surface-light"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? "🌑" : "☀️"}
        </button>
        {children}
      </body>
    </html>
  );
}
