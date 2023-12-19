"use client";

import { ImageInput } from "@components/inputs/image";
import Form from "../login/form";
import Input from "@components/inputs/input";
import { signIn } from "next-auth/react";
import { MdAccountCircle, MdEmail, MdOutlineLock } from "react-icons/md";
import { useEdgeStore } from "@lib/store";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@components/buttons/button";
import ErrorMessage from "(routes)/login/ErrorMessage";

export default function LoginPage() {
  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const profile = form.get("profile") as File;
    const { url } = await edgestore.publicImages.upload({
      file: profile,
      options: { temporary: true },
    });
    const data = Object.fromEntries(form.entries());
    signIn("sign-up", {
      ...data,
      profile: url,
      callbackUrl: `${window.location.origin}/app/friends`,
    }).then((res) => {
      if (!res) return;
      const { ok, error } = res;
      setError(error);
      setLoading(false);
      error
        ? edgestore.publicImages.delete({ url })
        : edgestore.publicImages.confirmUpload({ url });
      ok && router.push("/app/friends");
    });
  };
  return (
    <div className="h-screen w-screen bg-[url('https://uploads-ssl.webflow.com/5b61d6a92898676332523d67/5b631108ff62e8368acd3a2d_12.%20Tumbleweed.jpg')] bg-cover bg-no-repeat">
      {/* <div className=" relative h-screen w-full basis-2/3 max-md:hidden"></div> */}
      <div className="pointer-events-none absolute left-0 top-0 m-4 flex items-center gap-3 max-lg:hidden">
        <img className="aspect-auto h-auto w-16" src="../../icon.png" alt="" />
        <h1 className="text-2xl font-bold text-white">Chat App</h1>
      </div>
      <div className="absolute right-[5%] top-1/2 h-[90%] w-[30%] -translate-y-1/2 overflow-hidden rounded-xl transition-all max-lg:left-0 max-lg:top-0 max-lg:h-full max-lg:w-full max-lg:translate-y-0 max-lg:rounded-none">
        <div className="relative flex h-full flex-col items-center justify-center gap-4 overflow-auto bg-background-light p-10 dark:bg-background-dark">
          <Form title="Sign up" onSubmit={handleSubmit}>
            <ImageInput input={{ name: "profile" }} className="mx-auto" />
            <Input name="username" icon={MdAccountCircle} type="text" />
            <Input name="email" icon={MdEmail} type="email" />
            <Input name="password" icon={MdOutlineLock} type="password" />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <SubmitButton type="submit" name="Sign In" loading={isLoading} />
          </Form>
          <div className="font-bold text-gray-700 dark:text-white">
            Have an account already?
            <Link href="/login" className="mx-1 text-blue-500">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
