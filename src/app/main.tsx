"use client";

import { useMemo, useState, useEffect } from "react";
import { Sora } from "next/font/google";

const font = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function App({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("dark");
  const isDark = useMemo(() => theme === "dark", [theme]);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  return (
    <html lang="en" className={`${font.className} ${theme}`}>
      <body suppressHydrationWarning={true}>
        <button
          className="absolute right-0 top-0 z-20 m-5 cursor-pointer rounded-circle bg-surface-dark p-4 dark:bg-surface-light"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? "🌑" : "☀️"}
        </button>
        {children}
      </body>
    </html>
  );
}
