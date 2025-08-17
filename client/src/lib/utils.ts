import { nanoid } from "nanoid"
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const generateRoomId = () => {
    return nanoid(8);
}

export const generateMessageId = () => {
    return nanoid(10);
}

export function formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
