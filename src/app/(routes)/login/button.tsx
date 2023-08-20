import { PropsWithChildren } from "react";

interface Props {
  name: string;
}

const Button: React.FC<PropsWithChildren<Props>> = ({ name }) => {
  return (
    <button
      className="my-4 w-full rounded-lg bg-blue-700 px-8 py-4 text-white transition-all hover:bg-blue-600 active:scale-90"
      type="submit"
    >
      {name}
    </button>
  );
};

export default Button;
