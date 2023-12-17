import { twMerge } from "tw-merge";
import { clsx, ClassValue } from "clsx";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTimeFormat(time: string) {
  const date = new Date(time);
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  // return `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
}

export const addZero = (str: string | number) => ("0" + str).slice(-2);

// export function calcDaysDifference(startDate: Date, endDate: Date): number {
//   const diffInMilliseconds = endDate.getTime() - startDate.getTime();
//   return Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24));
// }

// export function formatDateToDDMMYY(date: Date): string {
//   const dd = String(date.getDate()).padStart(2, "0");
//   const mm = String(date.getMonth() + 1).padStart(2, "0");
//   const yy = String(date.getFullYear()).slice(-2);
//   return `${dd}/${mm}/${yy}`;
// }
export const urlRegex = /(https?:\/\/[^\s]+)/g;

export const isUrl = (word: string) => {
  return word?.match(urlRegex);
};

export const ExtractChannelID = (channel_name: string) => {
  return channel_name.split("@").at(-1);
};

export const UUID = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

export const groupBy = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => string,
) =>
  array.reduce(
    (acc, value, index, array) => {
      (acc[predicate(value, index, array)] ||= []).push(value);
      return acc;
    },
    {} as { [key: string]: T[] },
  );

export const secondsToISOFormet = (sec: number) => {
  if (!sec || sec === Infinity) return "00:00";
  const format = dayjs(new Date(sec * 1000));
  return format.isValid() ? format.format("mm:ss") : "00:00";
  // ? new Date(sec * 1000).toISOString().substring(14, 19)
  // : "00:00";
};

export const isDeepEqual = (x: any, y: any) => {
  const objKeys1 = Object.keys(x),
    objKeys2 = Object.keys(y);

  if (objKeys1.length !== objKeys2.length) return false;

  for (var key of objKeys1) {
    const val1 = x[key],
      val2 = y[key];
    const isObjects = isObject(val1) && isObject(val2);

    if (
      (isObjects && !isDeepEqual(val1, val2)) ||
      (!isObjects && val1 !== val2)
    ) {
      return false;
    }
  }
  return true;
};

const isObject = (object: object) => {
  return object != null && typeof object === "object";
};

export function normalizeUrl(url: string) {
  return url.replace(/\/\/www\./i, "//").replace(/\/$/, "");
}

export function removeEmpty(obj: object) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
