import type { ModEntry } from "../domain/entities/ModEntry";
import { ModExtractor } from "../domain/services/ModExtractor";
import type { IFileService } from "../infrastructure/storage/FileService";

export class CsvExporter {
  private fileService: IFileService;

  constructor(fileService: IFileService) {
    this.fileService = fileService;
  }

  exportToCSV(modEntries: ModEntry[], filename: string = "uo_mods.csv"): void {
    if (modEntries.length === 0) {
      console.warn("エクスポートするMODエントリーがありません");
      return;
    }

    const csvContent = ModExtractor.convertToCSV(modEntries);
    this.fileService.downloadCSV(csvContent, filename);
  }
}
