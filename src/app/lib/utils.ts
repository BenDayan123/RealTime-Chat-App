import { twMerge } from "tw-merge";
import { clsx, ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTimeFormat(time: string) {
  const date = new Date(time);
  return `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
}

const addZero = (str: string | number) => ("0" + str).slice(-2);

export function calcDaysDifference(startDate: Date, endDate: Date): number {
  const diffInMilliseconds = endDate.getTime() - startDate.getTime();
  return Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
}

export function formatDateToDDMMYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}
