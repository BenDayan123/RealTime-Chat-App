import { PropsWithChildren } from "react";
import Item from "./item";

interface Props {}

const TopNav: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  return <ul className="flex gap-2">{children}</ul>;
};

export { TopNav, Item };
