const size = 120;

export const AppLogo = () => {
  return (
    <div className="aspect-square max-w-[12rem] rounded-3xl bg-white p-3">
      <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 3}
          fill="transparent"
          strokeLinecap="round"
          stroke="#292d3b"
          strokeDasharray={size - 30}
          strokeDashoffset={10}
          strokeWidth={10}
        />
        <circle cx={size / 4} cy={size / 2} r={5} fill="#5328e8" />
      </svg>
    </div>
  );
};
