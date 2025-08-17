import { nanoid } from "nanoid"
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const generateRoomId = () => {
    return nanoid(8);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
