"use client";

import GridGlow from "@components/GlowGrid";
import { Switch } from "@components/inputs/switch";
import { useDarkMode } from "@hooks/useDarkMode";
import Image from "next/image";
import Logo from "../../icon.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode, toggle } = useDarkMode(true);

  return (
    <div className="h-screen w-screen bg-[url('https://uploads-ssl.webflow.com/5b61d6a92898676332523d67/5b633e2e10bfd0591c8fef61_99.%20Roman.jpg')] bg-cover bg-no-repeat">
      <div className="pointer-events-none absolute left-0 top-0 m-4 flex items-center gap-2 rounded-full bg-black/10 p-2 pr-4 max-lg:hidden">
        <Image
          className="aspect-auto rounded-full"
          height={55}
          width={55}
          src={Logo}
          alt="icon"
          quality={100}
        />
        <h1 className="text-2xl font-bold text-gray-100">Textify</h1>
      </div>
      <div className="absolute right-[5%] top-1/2 h-[90%] w-[30%] -translate-y-1/2 overflow-hidden transition-all max-lg:left-0 max-lg:top-0 max-lg:h-full max-lg:w-full max-lg:translate-y-0 max-lg:rounded-none">
        <div className="relative flex h-full flex-col items-center justify-center gap-4 overflow-auto rounded-xl bg-background-light p-10 dark:bg-background-dark max-lg:rounded-none">
          <GridGlow />
          {children}
        </div>
        <Switch
          checked={!isDarkMode}
          onChange={toggle}
          className="absolute bottom-0 left-0 m-4 w-[60px]"
        />
      </div>
    </div>
  );
}
