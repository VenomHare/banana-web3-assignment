import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const scrollbar_class = `
  [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-secondary
`;

export const truncateKey = (key: string, value: number = 6) => {
  if (key.length < (value * 2) + 3) {
    return key
  }
  else {
    return `${key.slice(0, value)}...${key.slice(key.length - value)}`
  }
}

export function generateSalt(length: number = 6) {
  const arr = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
  let salt = "";
  for (let i = 0; i < length; i++) {
    salt += arr[Math.floor(Math.random() * arr.length)];
  }
  return salt
}
