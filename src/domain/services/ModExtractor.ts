import type { ModEntry } from "../entities/ModEntry";
import { isValidModEntry } from "../entities/ModEntry";

export class ModExtractor {
  private static readonly MOD_REGEX = /([A-Za-z ]+)\s(\d+%?|\d+)/g;

  static extractMods(text: string): ModEntry[] {
    const extractedMods: ModEntry[] = [];
    let match;

    while ((match = this.MOD_REGEX.exec(text)) !== null) {
      const modEntry: ModEntry = {
        mod: match[1].trim(),
        value: match[2].trim(),
      };

      if (isValidModEntry(modEntry)) {
        extractedMods.push(modEntry);
      }
    }

    return extractedMods;
  }

  static convertToCSV(modEntries: ModEntry[]): string {
    if (modEntries.length === 0) {
      return "";
    }

    const csvHeader = "Mod,Value\n";
    const csvRows = modEntries.map((entry) => `"${entry.mod}","${entry.value}"`).join("\n");

    return csvHeader + csvRows;
  }
}
