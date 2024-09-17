import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @returns `null` if unable to convert
 */
export function convertTo6DigitsHex(str: string): string | null {
  const digitsAfterHashtag = str.slice(1);

  if (str.startsWith("#") && [3, 4].includes(digitsAfterHashtag.length)) {
    let result = "#";

    for (const digit of digitsAfterHashtag) {
      result = `${result}${digit.repeat(2)}`;
    }

    return result;
  }

  return null;
}
