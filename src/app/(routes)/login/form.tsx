"use client";

//TODO convert only the form tag to client component

import { PropsWithChildren } from "react";
import SocialButton from "@components/buttons/social";
import SubmitButton from "./button";
import GoogleLogo from "@images/logos/google.svg";
import TwitterLogo from "@images/logos/twitter.svg";
import MetaLogo from "@images/logos/meta.svg";
import { signIn } from "next-auth/react";
import { usePusher } from "@harelpls/use-pusher";

interface Props {
  title: string;
}

const Form: React.FC<PropsWithChildren<Props>> = ({ children, title }) => {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formDataObj = Object.fromEntries(formData.entries());
    signIn("credentials", {
      ...formDataObj,
      callbackUrl: `${window.location.origin}/chat`,
    });
  }
  return (
    <div className="relative flex h-screen basis-1/3 flex-col items-center justify-center overflow-auto bg-background-light p-10 dark:bg-background-dark max-md:flex-1">
      <h1 className="my-6 text-center text-6xl font-bold text-onBG-light dark:text-onBG-dark">
        {title}
      </h1>
      <div className="w-3/4 max-md:w-9/12">
        <div className="my-6 flex w-full content-stretch justify-center gap-4">
          <SocialButton provider="facebook" icon={MetaLogo} />
          <SocialButton provider="google" icon={GoogleLogo} />
          <SocialButton provider="twitter" icon={TwitterLogo} />
        </div>
        <div className="relative my-10 h-[1px] w-full rounded-md bg-onSurface-light opacity-60 dark:bg-onSurface-dark">
          <label className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-light p-3 text-onSurface-light dark:bg-background-dark dark:text-onSurface-dark">
            Or
          </label>
        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          {children}
          <SubmitButton name="Sign In" />
        </form>
      </div>
    </div>
  );
};

export default Form;
