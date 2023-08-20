import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface Props {
  provider: string;
  icon: any;
}

const SocialButton: React.FC<Props> = ({ provider, icon }) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/chat";

  return (
    <button
      className="flex h-10 flex-1 justify-center rounded-xl border-none bg-surface-light
      object-cover p-2 align-middle transition-all hover:scale-110 dark:bg-surface-dark"
      onClick={(e) => {
        e.preventDefault();
        signIn(provider, { callbackUrl, redirect: false });
      }}
    >
      <Image
        src={icon}
        alt={provider}
        className="pointer-events-none aspect-square h-full"
      />
    </button>
  );
};

export default SocialButton;
