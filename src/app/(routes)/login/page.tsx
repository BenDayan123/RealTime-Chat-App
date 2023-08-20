"use client";

import Form from "./form";
import Input from "@components/inputs/input";

export default function LoginPage() {
  return (
    <div className="flex w-screen">
      <div className="gradient-background relative h-screen w-full basis-2/3 max-md:hidden"></div>
      <Form title="Log in">
        <Input name="username" />
        <Input name="email" />
        <Input name="password" />
      </Form>
    </div>
  );
}
