"use client";

// import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

const Input: React.FC<Props> = (props) => {
  const { name, ...rest } = props;
  return (
    <div
      className="relative mt-4 flex items-center overflow-hidden shadow-lg rounded-lg border-2 border-tran bg-surface-light
     text-onSurface-light focus-within:border-blue-500 dark:bg-surface-dark dark:shadow-none dark:text-onSurface-dark"
    >
      {/* <AccountCircleIcon className="peer-foucs:fill-blue-500 mx-3 peer-valid:fill-blue-500" /> */}
      <div className="relative w-full">
        <input
          {...rest}
          type="text"
          className="peer w-full bg-tran p-3 pl-0 pt-6 outline-none"
          autoComplete="off"
          placeholder="&#8205;"
          required
          name={name}
        />
        <label
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 capitalize opacity-80 transition-all
          duration-200 peer-valid:top-[7px] peer-valid:translate-y-0 peer-valid:text-xs
          peer-valid:text-blue-500 peer-focus:top-[7px] peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:opacity-100"
        >
          {name}
        </label>
      </div>
    </div>
  );
};

export default Input;
// ${styleOnEvent(
//     "group-focus-within",
//     "left-2 top-0 translate-y-0"
//   )}
