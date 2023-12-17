"use client";

import Form from "./form";
import Input from "@components/inputs/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { MdEmail, MdOutlineLock } from "react-icons/md";

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    signIn("login", {
      ...data,
      callbackUrl: `${window.location.origin}/app/friends`,
    });
  };
  return (
    <div className="h-screen w-screen bg-[url('https://uploads-ssl.webflow.com/5b61d6a92898676332523d67/5b631108ff62e8368acd3a2d_12.%20Tumbleweed.jpg')] bg-cover bg-no-repeat">
      {/* <div className=" relative h-screen w-full basis-2/3 max-md:hidden"></div> */}
      <div className="pointer-events-none absolute left-0 top-0 m-4 flex items-center gap-3 max-lg:hidden">
        <img className="aspect-auto h-auto w-16" src="../../icon.png" alt="" />
        <h1 className="text-2xl font-bold text-white">Chat App</h1>
      </div>
      <div className="absolute right-[5%] top-1/2 h-[90%] w-[30%] -translate-y-1/2 transition-all max-lg:left-0 max-lg:top-0 max-lg:h-full max-lg:w-full max-lg:translate-y-0 max-lg:rounded-none">
        <div className="relative flex h-full flex-col items-center justify-center gap-4 overflow-auto rounded-xl bg-background-light p-10 dark:bg-background-dark">
          <Form title="Log in" onSubmit={(e) => handleSubmit(e)}>
            {/* <Input name="username" icon={MdAccountCircle} type="text" /> */}
            <Input name="email" icon={MdEmail} type="email" />
            <Input name="password" icon={MdOutlineLock} type="password" />
          </Form>
          <div className="font-bold text-gray-700 dark:text-white">
            Don&apos;t have an account?
            <Link href="/sign-up" className="mx-1 text-blue-500">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
