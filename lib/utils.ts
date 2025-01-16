// Add this function to the existing utils.ts file

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatName(name?: string | null | undefined): { firstName: string; lastName: string } {
  if (!name) {
    return { firstName: "", lastName: "" };
  }

  const [firstName, ...lastNameParts] = name.split(" ");
  const lastName = lastNameParts.join(" ");

  return {
    firstName: firstName || "",
    lastName: lastName || "",
  };
}

/* export function formatName(name: string | null | undefined): { firstName: string; lastName: string } {
  if (!name) {
    return { firstName: "", lastName: "" };
  }

  const [firstName, lastName] = name.split(" ");
  return {
    firstName: firstName || "",
    lastName: lastName || "",
  };
} */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}