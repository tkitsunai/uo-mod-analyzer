import type { AnalyzedItem } from "../domain/entities/AnalyzedItem";
import type { CsvExportOptions } from "../domain/entities/CsvExportOptions";
import { CsvExporter } from "../domain/services/CsvExporter";

/**
 * CSVエクスポート機能のユースケース
 * プレゼンテーション層とドメインサービス間のオーケストレータ
 */
export class CsvExportUseCase {
  private csvExporter: CsvExporter;

  constructor(csvExporter?: CsvExporter) {
    this.csvExporter = csvExporter || new CsvExporter();
  }

  /**
   * CSVファイルとしてエクスポート
   */
  async exportToFile(items: AnalyzedItem[], options: CsvExportOptions): Promise<void> {
    if (items.length === 0) {
      throw new Error("エクスポートするアイテムがありません");
    }

    await this.csvExporter.exportToFile(items, options);
  }

  /**
   * クリップボードにコピー
   */
  async copyToClipboard(items: AnalyzedItem[], options: CsvExportOptions): Promise<void> {
    if (items.length === 0) {
      throw new Error("コピーするアイテムがありません");
    }

    await this.csvExporter.copyToClipboard(items, options);
  }

  /**
   * エクスポート可能なアイテム数を取得
   */
  getExportableItemCount(items: AnalyzedItem[]): number {
    return items.filter((item) => item.modEntries.length > 0).length;
  }

  /**
   * エクスポートオプションをバリデート
   */
  validateExportOptions(options: CsvExportOptions): boolean {
    return typeof options.includeHeaders === "boolean";
  }
}
