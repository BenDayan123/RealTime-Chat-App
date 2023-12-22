import { PropsWithChildren } from "react";
// import SocialButton from "@components/buttons/social";
// import GoogleLogo from "@images/logos/google.svg";
// import TwitterLogo from "@images/logos/twitter.svg";
// import MetaLogo from "@images/logos/meta.svg";

interface Props
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  title: string;
}

const Form: React.FC<PropsWithChildren<Props>> = ({
  children,
  title,
  ...rest
}) => {
  return (
    <div className="flex-center z-20 w-full flex-col gap-2">
      <h1 className="text-center text-5xl font-bold text-onBG-light dark:text-onBG-dark">
        {title}
      </h1>
      <form {...rest} className="w-3/4 max-md:w-9/12">
        {children}
      </form>
    </div>
  );
};

export default Form;
