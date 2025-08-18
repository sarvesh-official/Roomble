import { nanoid } from "nanoid"
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AnimationStart, AnimationVariant } from '@/components/ui/theme/theme-animations';

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

// GIF URLs for theme toggle animations
export const THEME_TOGGLE_GIFS = [
    "https://media.giphy.com/media/KBbr4hHl9DSahKvInO/giphy.gif?cid=790b76112m5eeeydoe7et0cr3j3ekb1erunxozyshuhxx2vl&ep=v1_stickers_search&rid=giphy.gif&ct=s",
    "https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3JwcXdzcHd5MW92NWprZXVpcTBtNXM5cG9obWh0N3I4NzFpaDE3byZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/WgsVx6C4N8tjy/giphy.gif",
    "https://media.giphy.com/media/ArfrRmFCzYXsC6etQX/giphy.gif?cid=ecf05e47kn81xmnuc9vd5g6p5xyjt14zzd3dzwso6iwgpvy3&ep=v1_stickers_search&rid=giphy.gif&ct=s",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWI1ZmNvMGZyemhpN3VsdWp4azYzcWUxcXIzNGF0enp0eW1ybjF0ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/Fa6uUw8jgJHFVS6x1t/giphy.gif",
    // "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmhlYjVwbmNvZTAyZWJ1bDB2amoxc2UybzEzdzFlMWswNWI5Zzc3ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/lMr5FT3aHDnL13TLul/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGlkaG40MTA2MWE0em0wZ2NjcGtwZXFsdThpZHZtaXNyNThxamUydCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/FopJy18z4t5hHlViZn/giphy.gif",
    
];

// Animation variants for theme toggle (removed default animation)
export const THEME_TOGGLE_VARIANTS: AnimationVariant[] = ["circle-blur", "polygon", "gif"];

// Animation start positions for theme toggle
export const THEME_TOGGLE_START_POSITIONS: AnimationStart[] = ["top-left", "top-right", "bottom-left", "bottom-right", "center"];

/**
 * Returns random animation settings for theme toggle
 * @returns Object containing random variant, start position, and URL (if variant is gif)
 */
export function getRandomThemeAnimation(): { variant: AnimationVariant; start: AnimationStart; url: string } {
    // Weighted random selection to favor GIFs (70% chance)
    const useGif = Math.random() < 0.7;

    // If using gif, set variant to gif, otherwise select from other variants
    const randomVariant = useGif ? "gif" :
        THEME_TOGGLE_VARIANTS.filter(v => v !== "gif")[Math.floor(Math.random() * (THEME_TOGGLE_VARIANTS.length - 1))];

    // Select random start position
    const randomStart = THEME_TOGGLE_START_POSITIONS[Math.floor(Math.random() * THEME_TOGGLE_START_POSITIONS.length)];

    // If variant is gif, select random URL
    const randomUrl = randomVariant === "gif" ?
        THEME_TOGGLE_GIFS[Math.floor(Math.random() * THEME_TOGGLE_GIFS.length)] : "";

    return { variant: randomVariant, start: randomStart, url: randomUrl };
}
