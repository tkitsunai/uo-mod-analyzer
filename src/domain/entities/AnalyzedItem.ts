import type { ModEntry } from "./ModEntry";

export interface AnalyzedItem {
  id: string;
  name: string;
  analyzedAt: Date;
  imageUrl?: string;
  modEntries: ModEntry[];
  ocrText: string;
  confidence: number;
}

export const createAnalyzedItem = (
  name: string,
  modEntries: ModEntry[],
  ocrText: string,
  confidence: number,
  imageUrl?: string
): AnalyzedItem => {
  return {
    id: crypto.randomUUID(),
    name,
    analyzedAt: new Date(),
    imageUrl,
    modEntries,
    ocrText,
    confidence,
  };
};

export const formatItemName = (item: AnalyzedItem): string => {
  return item.name || `未命名アイテム (${item.analyzedAt.toLocaleDateString()})`;
};

export const getModCount = (item: AnalyzedItem): number => {
  return item.modEntries.length;
};
