"use client";

import React, { useMemo, useState } from "react";
import { MdEdit, MdOutlineImageSearch } from "react-icons/md";
import { cn } from "@lib/utils";

type Props = {
  input: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  image?: File;
  onChangeFile?(image: File): void;
  defaultImage?: string;
  className?: string;
};
// "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg"
export const ImageInput: React.FC<Props> = ({
  onChangeFile,
  defaultImage,
  className,
  input,
}) => {
  const [image, setImage] = useState<File>(new File([""], "filename"));
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      void setImage(e.target.files[0] || null);
      onChangeFile && void onChangeFile(e.target.files[0] || null);
    }
  };

  const fileUrl = useMemo(() => {
    return image && image.size !== 0
      ? URL.createObjectURL(image)
      : defaultImage ||
          "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg";
  }, [image, defaultImage]);

  return (
    <div
      className={cn(
        "group relative aspect-square w-36 rounded-circle bg-cover bg-center bg-no-repeat transition-transform active:scale-90",
        className,
      )}
      style={{ backgroundImage: `url(${fileUrl})` }}
    >
      <div className="absolute right-0 top-0 z-30 aspect-square rounded-full bg-gray-200 p-2">
        <MdOutlineImageSearch size={25} className="fill-gray-500" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden rounded-full bg-tran transition-all group-hover:bg-black/70">
        <MdEdit
          size={60}
          className="absolute-center pointer-events-none absolute z-10 fill-white opacity-0 transition-[opacity] group-hover:opacity-100"
        />
      </div>
      <input
        className="z-20 h-full w-full cursor-pointer opacity-0"
        {...input}
        type="file"
        accept="image/*"
        onChange={onImageChange}
      />
    </div>
  );
};
