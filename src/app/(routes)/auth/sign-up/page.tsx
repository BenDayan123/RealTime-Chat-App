"use client";

import { ImageInput } from "@components/inputs/image";
import Form from "../form";
import Input from "@components/inputs/input";
import { signIn } from "next-auth/react";
import { MdAccountCircle, MdEmail, MdOutlineLock } from "react-icons/md";
import { useEdgeStore } from "@lib/store";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@components/buttons/button";
import ErrorMessage from "(routes)/auth/ErrorMessage";

export default function LoginPage() {
  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
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
      redirect: false,
    }).then(async (res) => {
      if (!res) return;
      const { error } = res;
      setError(error);
      setLoading(false);
      if (error) {
        await edgestore.publicImages.delete({ url });
      } else {
        await edgestore.publicImages.confirmUpload({ url });
        router.push("/app/friends");
      }
    });
  };
  return (
    <Form title="Sign up" onSubmit={handleSubmit}>
      <ImageInput input={{ name: "profile" }} className="mx-auto" />
      <Input name="username" icon={MdAccountCircle} type="text" />
      <Input name="email" icon={MdEmail} type="email" />
      <Input name="password" icon={MdOutlineLock} type="password" />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <SubmitButton
        type="submit"
        name="Create an account"
        loading={isLoading}
      />
      <div className="my-2 text-center font-bold text-gray-700 dark:text-white">
        Have an account already?
        <Link href="/auth/login" className="mx-1 text-blue-500">
          Login
        </Link>
      </div>
    </Form>
  );
}
