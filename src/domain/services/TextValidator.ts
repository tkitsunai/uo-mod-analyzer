import { ConfigurableOcrAnalyzer } from "./ConfigurableOcrAnalyzer";
import { DEFAULT_UO_OCR_CONFIG } from "../entities/OcrAnalysisConfig";

/**
 * テキストの妥当性検証を行うドメインサービス
 * 設定可能なOCR解析システムと統合
 */
export class TextValidator {
  private static analyzer = new ConfigurableOcrAnalyzer(DEFAULT_UO_OCR_CONFIG);
  /**
   * テキストをクリーンアップする（設定可能なアナライザーを使用）
   */
  static cleanText(text: string): string {
    return this.analyzer.preprocessText(text);
  }

  /**
   * アイテム名として有効かどうかを判定（設定に基づく）
   */
  static isValidItemName(text: string): boolean {
    return this.analyzer.isValidItemName(text);
  }

  /**
   * MODテキストっぽいかどうかを判定（設定に基づく）
   */
  static isLikelyModText(text: string): boolean {
    return this.analyzer.isLikelyModText(text);
  }

  /**
   * 設定を更新する
   */
  static updateConfig(partialConfig: Parameters<ConfigurableOcrAnalyzer["updateConfig"]>[0]): void {
    this.analyzer.updateConfig(partialConfig);
  }

  /**
   * テキストが意味のあるアイテム名候補かを包括的に判定
   */
  static isViableItemNameCandidate(text: string): ValidationResult {
    const cleanText = this.cleanText(text);

    if (!this.isValidItemName(text)) {
      return {
        isValid: false,
        reason: "invalid_format",
        cleanedText: cleanText,
      };
    }

    if (this.isLikelyModText(text)) {
      return {
        isValid: false,
        reason: "likely_mod_text",
        cleanedText: cleanText,
      };
    }

    return {
      isValid: true,
      reason: "valid",
      cleanedText: cleanText,
    };
  }
}

export interface ValidationResult {
  isValid: boolean;
  reason: "valid" | "invalid_format" | "likely_mod_text";
  cleanedText: string;
}
