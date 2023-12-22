import { PropsWithChildren } from "react";

const ErrorMessage: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="my-2 rounded-lg bg-red-700 px-4 py-3 leading-normal text-red-100"
      role="alert"
    >
      <strong className="font-bold">Error!</strong>
      <span className="mx-2 block sm:inline">{children}</span>
    </div>
  );
};
export default ErrorMessage;
