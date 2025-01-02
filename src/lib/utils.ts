import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs"
import { Pagination } from "@/api/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeString(str: string) {
  if (!str) return '';
  if (str.includes('-')) return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function debounce(func: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export async function saltAndHashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function checkPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export function convertToCurrency(amount: number) {
  return Math.round(amount * 100);
}

export function isEmptyString(str: string | undefined | null) {
  if (!str) return true;
  return str.trim().length === 0;
}

export const getPagination = ({ page = 1, take = 9 }: Pagination) => {
  page = Number(page);
  take = Number(take);
  if (isNaN(page) || isNaN(take)) return { skip: 0, take: 9 };
  const skip = (page - 1) * take;
  return { skip, take };
};

export const checkSearchParam = (searchParam: string | string[] | undefined): string[] | undefined => {
  if (Array.isArray(searchParam)) {
    return searchParam;
  } else if (typeof searchParam === 'string') {
    return [searchParam];
  }
  return undefined;
}