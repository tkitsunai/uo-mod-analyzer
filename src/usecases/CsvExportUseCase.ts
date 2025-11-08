import type { AnalyzedItem } from "../domain/entities/AnalyzedItem";
import type { CsvExportOptions } from "../domain/entities/CsvExportOptions";
import { CsvExporter } from "../domain/services/CsvExporter";

export class CsvExportUseCase {
  private csvExporter: CsvExporter;

  constructor(csvExporter?: CsvExporter) {
    this.csvExporter = csvExporter || new CsvExporter();
  }

  async exportToFile(items: AnalyzedItem[], options: CsvExportOptions): Promise<void> {
    if (items.length === 0) {
      throw new Error("エクスポートするアイテムがありません");
    }

    await this.csvExporter.exportToFile(items, options);
  }

  async copyToClipboard(items: AnalyzedItem[], options: CsvExportOptions): Promise<void> {
    if (items.length === 0) {
      throw new Error("コピーするアイテムがありません");
    }

    await this.csvExporter.copyToClipboard(items, options);
  }

  getExportableItemCount(items: AnalyzedItem[]): number {
    return items.filter((item) => item.modEntries.length > 0).length;
  }

  validateExportOptions(options: CsvExportOptions): boolean {
    return typeof options.includeHeaders === "boolean";
  }
}
