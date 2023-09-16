import { Jelly } from "@uiball/loaders";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Jelly size={80} speed={0.9} color="white" />
    </div>
  );
}
