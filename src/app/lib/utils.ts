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
  return Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24));
}

export function formatDateToDDMMYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}
