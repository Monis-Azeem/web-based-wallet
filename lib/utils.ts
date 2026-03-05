import { clsx, type ClassValue } from "clsx" //clsx helps us write conditional classes, like css based on js variables
import { twMerge } from "tailwind-merge" //twMerge resolve conflicts. Suppose there are two bg-primary and bg-white. It decides which to use.

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
