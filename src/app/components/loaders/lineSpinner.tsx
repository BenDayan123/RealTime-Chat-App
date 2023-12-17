"use client";

import { useDarkMode } from "@hooks/useDarkMode";
import { useEffect } from "react";

interface Props {
  size?: string | number;
}

export default function Loading({ size = "40" }: Props) {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    async function getLoader() {
      const { lineSpinner } = await import("ldrs");
      lineSpinner.register();
    }
    getLoader();
  }, []);

  return (
    <div className="flex-center w-full p-3">
      <l-line-spinner
        size={size}
        stroke="3"
        speed="1"
        color={isDarkMode ? "white" : "black"}
      ></l-line-spinner>
    </div>
  );
}
