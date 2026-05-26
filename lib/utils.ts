import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function isNotNullOrUndefined(value: any) {
  return value != null || value != undefined;
}

function toSentenceCase(str: string) {
  return str
    .toLowerCase()
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export { cn, isNotNullOrUndefined, toSentenceCase };
