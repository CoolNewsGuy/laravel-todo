import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the full form of a hex color (either with 6 digits or 8 if an alpha channel was provided).
 *
 * If `hexStr` is already in the full form, it returns it.
 *
 * Otherwise returns `null`, if `hexStr` contains invalid hex digits.
 */
export function getTheFullHexColorForm(hexStr: string): string | null {
  const digitsAfterHashtag = hexStr.slice(1);

  if (hexStr.startsWith("#") && containsOnlyHexDigits(hexStr.slice(1))) {
    if ([3, 4].includes(digitsAfterHashtag.length)) {
      let result = "#";

      for (const digit of digitsAfterHashtag) {
        result = `${result}${digit.repeat(2)}`;
      }

      return result;
    }

    if ([6, 8].includes(digitsAfterHashtag.length)) {
      return hexStr;
    }
  }

  return null;
}

export function containsOnlyHexDigits(str: string): boolean {
  return str.split("").filter((c) => !c.match(/^[0-9A-F]+$/i)).length === 0;
}

/**
 * Generate a random 6-digits hex color.
 */
export function generateRandomHexColor() {
  const hexDigits = "0123456789ABCDEF";
  let result = "#";

  for (let i = 0; i < 6; i++) {
    result += hexDigits[Math.floor(Math.random() * hexDigits.length)];
  }

  return result as `#${string}`;
}

export function doAllColorChannelsHaveTheSameLength(data: {
  red: string;
  green: string;
  blue: string;
}) {
  return (
    data.red.length === data.green.length &&
    data.red.length === data.blue.length
  );
}
