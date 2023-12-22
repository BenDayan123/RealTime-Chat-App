"use client";

import Form from "../form";
import Input from "@components/inputs/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { MdEmail, MdOutlineLock } from "react-icons/md";
import { useRouter } from "next/navigation";
import ErrorMessage from "../ErrorMessage";
import SubmitButton from "@components/buttons/button";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    signIn("login", {
      ...data,
      redirect: false,
    }).then((res) => {
      if (!res) return;
      const { ok, error } = res;
      setError(error);
      setLoading(false);
      ok && router.push("/app/friends");
    });
  };
  return (
    <>
      <Form title="Welcome Back!" onSubmit={(e) => handleSubmit(e)}>
        <Input name="email" icon={MdEmail} type="email" />
        <Input name="password" icon={MdOutlineLock} type="password" />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SubmitButton type="submit" name="Login" loading={isLoading} />
      </Form>
      <div className="font-bold text-gray-700 dark:text-white">
        Don&apos;t have an account?
        <Link href="/auth/sign-up" className="mx-1 text-blue-500">
          Login
        </Link>
      </div>
    </>
  );
}
