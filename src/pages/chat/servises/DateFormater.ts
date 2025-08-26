// shared/utils/dateUtils.ts
import { format } from "date-fns";

export function DateFormater(moment: string): string {
  const date = new Date(moment.replace(" ", "T"));
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // сьогодні → час до секунд
  if (date.toDateString() === now.toDateString()) {
    return format(date, "HH:mm:ss");
  }

  // не далі трьох днів
  if (diffDays >= 1 && diffDays <= 3) {
    return `${diffDays} ${getDayWord(diffDays)} тому, ${format(date, "HH:mm")}`;
  }

  // цей самий рік
  if (date.getFullYear() === now.getFullYear()) {
    return `${format(date, "d MMMM")}, ${format(date, "HH:mm")}`;
  }

  // минулі роки
  return `${format(date, "d MMMM yyyy 'р.'")}, ${format(date, "HH:mm")}`;
}

function getDayWord(days: number): string {
  if (days === 1) return "день";
  if (days >= 2 && days <= 4) return "дні";
  return "днів";
}
