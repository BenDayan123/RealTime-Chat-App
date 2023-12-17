"use client";

import { useEffect } from "react";
import { useDarkMode } from "@hooks/useDarkMode";
import type {} from "ldrs";

export default function Loading() {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    async function getLoader() {
      const { squircle } = await import("ldrs");
      squircle.register();
    }
    getLoader();
  }, []);

  return (
    <div className="w-full h-full flex-center">
      <div className="fill-red-500">
        <l-squircle
          size="60"
          stroke="5"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed=".8"
          color={isDarkMode ? "white" : "black"}
        ></l-squircle>
      </div>
    </div>
  );
}
