"use client";

import { useEffect } from "react";

export default function Loading() {
  useEffect(() => {
    async function getLoader() {
      const { pulsar } = await import("ldrs");
      pulsar.register();
    }
    getLoader();
  }, []);

  return (
    <div className="w-full h-full flex-center">
      <div>
        <l-pulsar size="20" speed="1.75" color="white"></l-pulsar>
      </div>
    </div>
  );
}
