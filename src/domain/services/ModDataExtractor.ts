import type { ModEntry } from "../entities/ModEntry";
import { ConfigurableOcrAnalyzer } from "./ConfigurableOcrAnalyzer";
import { DEFAULT_UO_OCR_CONFIG } from "../entities/OcrAnalysisConfig";

/**
 * テキストからMOD情報を抽出する専用サービス
 * 設定可能なOCR解析システムへの互換性レイヤー
 */
export class ModDataExtractor {
  private static readonly MOD_REGEX = /([A-Za-z ]+)\s(\d+%?|\d+)/g;
  private static analyzer = new ConfigurableOcrAnalyzer(DEFAULT_UO_OCR_CONFIG);

  /**
   * テキストからMODエントリを抽出（段階的フィルタリング適用）
   * 設定可能なOCR解析システムを使用
   */
  static extractMods(text: string, applyUOFilter: boolean = true): ModEntry[] {
    // 設定可能なアナライザーを使用
    if (applyUOFilter !== this.analyzer.getConfig().applyUltimaOnlineFiltering) {
      // フィルタ設定が異なる場合は設定を更新
      this.analyzer.updateConfig({ applyUltimaOnlineFiltering: applyUOFilter });
    }

    return this.analyzer.extractMods(text);
  }

  /**
   * MODエントリをCSV形式に変換
   */
  static convertToCSV(modEntries: ModEntry[]): string {
    if (modEntries.length === 0) {
      return "";
    }

    const csvHeader = "Mod,Value\n";
    const csvRows = modEntries.map((entry) => `"${entry.mod}","${entry.value}"`).join("\n");

    return csvHeader + csvRows;
  }

  /**
   * 抽出に使用する正規表現パターンを取得（テスト用）
   */
  static getExtractionPattern(): RegExp {
    return this.MOD_REGEX;
  }
}
