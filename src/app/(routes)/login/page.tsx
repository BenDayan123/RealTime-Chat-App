import Form from "./form";
import Input from "@components/inputs/input";
import { MdAccountCircle, MdEmail, MdOutlineLock } from "react-icons/md";

export default function LoginPage() {
  return (
    <div className="flex w-screen">
      <div className="gradient-background relative h-screen w-full basis-2/3 max-md:hidden"></div>
      <Form title="Log in">
        <Input name="username" icon={MdAccountCircle} />
        <Input name="email" icon={MdEmail} />
        <Input name="password" icon={MdOutlineLock} />
      </Form>
    </div>
  );
}
