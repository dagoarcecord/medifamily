import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-ES", {
      year: "numeric", month: "short", day: "numeric"
    });
  } catch {
    return dateStr;
  }
}

export function formatTime(time: string): string {
  if (!time) return "";
  return time;
}

export function daysFromNow(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function estadoColor(estado: string): string {
  switch (estado) {
    case "Pendiente": return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
    case "Completada": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "Reprogramada": return "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300";
    case "Cancelada": return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300";
    case "Recogido": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
    default: return "bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300";
  }
}

export function iniciales(nombre: string): string {
  return nombre.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]).join("").toUpperCase();
}
