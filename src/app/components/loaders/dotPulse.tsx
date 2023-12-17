"use client";

import { useEffect } from "react";

export default function Loading() {
  useEffect(() => {
    async function getLoader() {
      const { dotPulse } = await import("ldrs");
      dotPulse.register();
    }
    getLoader();
  }, []);

  return (
    <div className="w-full h-full flex-center">
      <div>
        <l-dot-pulse size="20" speed="1.3" color="white"></l-dot-pulse>
      </div>
    </div>
  );
}
