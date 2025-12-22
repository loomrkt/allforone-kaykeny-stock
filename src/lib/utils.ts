import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isImage(extension: string): boolean {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".tiff",
    ".svg",
    ".ico",
    ".avif",
    "image",
  ];
  return imageExtensions.includes(extension.toLowerCase());
}

export function truncateText(texte: string, longueurMax?: number) {
  const maxLength = longueurMax ?? 30;
  if (texte.length <= maxLength) {
    return texte;
  }
  return texte.slice(0, longueurMax).trim() + "...";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEntityName(entities: any[], id: string) {
  return entities.filter((entity) => entity.id === id)[0]?.name;
}
