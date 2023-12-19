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
    <>
      <h1 className="text-center text-6xl font-bold text-onBG-light dark:text-onBG-dark">
        {title}
      </h1>
      <div className="w-3/4 max-md:w-9/12">
        {/* <div className="relative my-10 h-[1px] w-full rounded-md bg-onSurface-light opacity-60 dark:bg-onSurface-dark">
          <label className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-light p-3 text-onSurface-light dark:bg-background-dark dark:text-onSurface-dark">
            Or
          </label>
        </div> */}
        <form className="w-full" {...rest}>
          {children}
        </form>
      </div>
    </>
  );
};

export default Form;
{
  /* <div className="my-6 flex w-full content-stretch justify-center gap-4">
  <SocialButton provider="facebook" icon={MetaLogo} />
  <SocialButton provider="google" icon={GoogleLogo} />
  <SocialButton provider="twitter" icon={TwitterLogo} />
</div> */
}
