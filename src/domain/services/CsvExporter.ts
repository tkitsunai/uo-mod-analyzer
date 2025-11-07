import type { AnalyzedItem } from "../entities/AnalyzedItem";
import type { CsvExportOptions } from "../entities/CsvExportOptions";
import type {
  IDownloadService,
  IClipboardService,
} from "../../infrastructure/browser/BrowserServices";
import {
  BrowserDownloadService,
  BrowserClipboardService,
} from "../../infrastructure/browser/BrowserServices";

export class CsvExporter {
  private downloadService: IDownloadService;
  private clipboardService: IClipboardService;

  constructor(downloadService?: IDownloadService, clipboardService?: IClipboardService) {
    this.downloadService = downloadService || new BrowserDownloadService();
    this.clipboardService = clipboardService || new BrowserClipboardService();
  }

  private generateCsv(items: AnalyzedItem[], options: CsvExportOptions): string {
    const lines: string[] = [];

    // ヘッダー行
    if (options.includeHeaders) {
      const headers = ["アイテム名", "MOD情報"];
      lines.push(headers.join(","));
    }

    // データ行
    items.forEach((item) => {
      const row: string[] = [];

      // アイテム名
      row.push(`"${item.name.replace(/"/g, '""')}"`);

      // MOD情報
      const modText = item.modEntries.map((mod) => `${mod.mod}: ${mod.value}`).join("; ");
      row.push(`"${modText.replace(/"/g, '""')}"`);

      lines.push(row.join(","));
    });

    return lines.join("\n");
  }

  public async exportToFile(items: AnalyzedItem[], options: CsvExportOptions): Promise<void> {
    const csvContent = this.generateCsv(items, options);
    const filename = "uo_mods_export.csv";

    this.downloadService.downloadFile(csvContent, filename);
  }

  public async copyToClipboard(items: AnalyzedItem[], options: CsvExportOptions): Promise<void> {
    const csvContent = this.generateCsv(items, options);
    await this.clipboardService.writeText(csvContent);
  }
}
