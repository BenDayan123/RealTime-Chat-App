import { Variants } from "framer-motion";
export { AddParticipantsPage } from "./AddParticipants";
export { InfoPage } from "./Info";
export { EditGroupPage } from "./EditGroup";

export interface Params {
  switchPage: (number: number) => void;
}

export const variants: Variants = {
  animate: { opacity: 1, scale: 1 },
  initial: { opacity: 0, scale: 0.9 },
  exit: { opacity: 0, scale: 0.9 },
};
