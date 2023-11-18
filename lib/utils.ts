import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export function toUpperCaseLng(lng: string) {
  const items = lng.split('-');
  if (items.length === 1)
    return lng;
  items[1] = items[1].toUpperCase();
  return items.join('-');
}