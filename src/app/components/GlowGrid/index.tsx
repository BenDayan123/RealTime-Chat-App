import Image from "next/image";
import "./style.scss";

interface Props {}

const GridGlow: React.FC<Props> = () => {
  return (
    <>
      <div className="absolute left-1/2 top-0 h-[1px] w-1/3 -translate-x-1/2 bg-gradient-to-r from-tran via-black to-tran dark:via-white"></div>
      <div className="glow absolute left-1/2 top-0 h-[250px] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-circle bg-gradient-to-r from-blue-400 to-blue-700 blur-3xl dark:h-[150px]"></div>
      <svg
        stroke="white"
        fill="transparent"
        className="grid"
        viewBox="0 0 1600 780"
      >
        <pattern
          id="small-grid"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect strokeWidth="0.2" width="100%" height="100%"></rect>
        </pattern>

        <pattern
          id="big-grid"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <rect width="100%" height="100%"></rect>
        </pattern>

        <rect width="100%" height="100%" fill="url(#big-grid)"></rect>
        <rect width="100%" height="100%" fill="url(#small-grid)"></rect>
      </svg>
      <Image
        className="pointer-events-none absolute left-1/2 top-0 z-10 mt-5 aspect-auto -translate-x-1/2 drag-none"
        height={100}
        width={100}
        src="/../../icon.png"
        alt="icon"
        quality={100}
      />
    </>
  );
};

export default GridGlow;
