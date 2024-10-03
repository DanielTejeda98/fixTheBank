import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function isNotNullOrUndefined (value: any) {
  return value != null || value != undefined;
}

export {
  cn,
  isNotNullOrUndefined
}
