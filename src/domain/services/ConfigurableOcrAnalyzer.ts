import type { ModEntry } from "../entities/ModEntry";
import { isValidModEntry } from "../entities/ModEntry";
import type { OcrAnalysisConfig } from "../entities/OcrAnalysisConfig";
import { DEFAULT_UO_OCR_CONFIG } from "../entities/OcrAnalysisConfig";
import { UltimaOnlineModFilter } from "./UltimaOnlineModFilter";

/**
 * 設定可能なOCRテキスト解析ルールサービス
 * 解析ルールを外部から設定可能にし、テスタビリティを向上
 */
export class ConfigurableOcrAnalyzer {
  private config: OcrAnalysisConfig;

  constructor(config: OcrAnalysisConfig = DEFAULT_UO_OCR_CONFIG) {
    this.config = { ...config };
  }

  /**
   * 設定を更新
   */
  updateConfig(partialConfig: Partial<OcrAnalysisConfig>): void {
    this.config = { ...this.config, ...partialConfig };
  }

  /**
   * 現在の設定を取得
   */
  getConfig(): OcrAnalysisConfig {
    return { ...this.config };
  }

  /**
   * OCRテキストの前処理
   */
  preprocessText(text: string): string {
    let processed = text;

    if (this.config.textPreprocessing.normalizeWhitespace) {
      processed = processed.replace(/\s+/g, " ");
    }

    if (this.config.textPreprocessing.trimLines) {
      processed = processed
        .split("\n")
        .map((line) => line.trim())
        .join("\n");
    }

    if (this.config.textPreprocessing.removeEmptyLines) {
      processed = processed
        .split("\n")
        .filter((line) => line.length > 0)
        .join("\n");
    }

    return processed;
  }

  /**
   * 設定されたパターンでMODを抽出
   */
  extractMods(text: string): ModEntry[] {
    const preprocessedText = this.preprocessText(text);

    // 1. 設定された正規表現で抽出
    const rawMods: ModEntry[] = [];
    let match;

    // RegExpのglobalフラグをリセット
    const pattern = new RegExp(
      this.config.modExtractionPattern.source,
      this.config.modExtractionPattern.flags
    );

    while ((match = pattern.exec(preprocessedText)) !== null) {
      const modEntry: ModEntry = {
        mod: match[1].trim(),
        value: match[2].trim(),
      };

      rawMods.push(modEntry);
    }

    // 2. 基本的な妥当性フィルタ
    const validMods = rawMods.filter(isValidModEntry);

    // 3. UO固有のフィルタ（オプション）
    const finalMods = this.config.applyUltimaOnlineFiltering
      ? UltimaOnlineModFilter.filterValidMods(validMods)
      : validMods;

    // デバッグ情報出力
    if (this.config.enableDebugLogging && rawMods.length > finalMods.length) {
      const stats = UltimaOnlineModFilter.getFilterStats(rawMods, finalMods);
      console.log(
        `🔧 Configurable OCR Analysis: ${stats.originalCount} → ${stats.filteredCount} (${stats.removalRate} removed)`
      );
    }

    return finalMods;
  }

  /**
   * アイテム名の有効性を設定に基づいて判定
   */
  isValidItemName(name: string): boolean {
    const validation = this.config.itemNameValidation;
    const cleanName = this.cleanItemName(name);

    // 長さチェック
    if (cleanName.length < validation.minLength || cleanName.length > validation.maxLength) {
      if (this.config.enableDebugLogging) {
        console.log(
          `❌ Item name validation failed (length): "${cleanName}" (${cleanName.length} chars)`
        );
      }
      return false;
    }

    // 許可文字パターンチェック
    if (!validation.allowedCharacterPattern.test(cleanName)) {
      if (this.config.enableDebugLogging) {
        console.log(`❌ Item name validation failed (characters): "${cleanName}"`);
      }
      return false;
    }

    // 除外パターンチェック
    for (const excludedPattern of validation.excludedPatterns) {
      if (excludedPattern.test(cleanName)) {
        if (this.config.enableDebugLogging) {
          console.log(`❌ Item name validation failed (excluded pattern): "${cleanName}"`);
        }
        return false;
      }
    }

    return true;
  }

  /**
   * MODテキストかどうかを設定されたパターンで判定
   */
  isLikelyModText(text: string): boolean {
    return this.config.modTextPatterns.some((pattern) => pattern.test(text));
  }

  /**
   * アイテム名をクリーンアップ
   */
  private cleanItemName(name: string): string {
    return name
      .replace(/[^\w\s\-\+\(\)]/g, "") // 特殊文字を除去
      .replace(/\s+/g, " ") // 連続する空白を単一に
      .trim();
  }

  /**
   * 設定の妥当性を検証
   */
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 正規表現の妥当性チェック
    try {
      new RegExp(this.config.modExtractionPattern.source, this.config.modExtractionPattern.flags);
    } catch (error) {
      errors.push(`Invalid MOD extraction pattern: ${error}`);
    }

    // 文字パターンの妥当性チェック
    try {
      new RegExp(this.config.itemNameValidation.allowedCharacterPattern.source);
    } catch (error) {
      errors.push(`Invalid allowed character pattern: ${error}`);
    }

    // 除外パターンの妥当性チェック
    this.config.itemNameValidation.excludedPatterns.forEach((pattern, index) => {
      try {
        new RegExp(pattern.source, pattern.flags);
      } catch (error) {
        errors.push(`Invalid excluded pattern #${index}: ${error}`);
      }
    });

    // MODテキストパターンの妥当性チェック
    this.config.modTextPatterns.forEach((pattern, index) => {
      try {
        new RegExp(pattern.source, pattern.flags);
      } catch (error) {
        errors.push(`Invalid MOD text pattern #${index}: ${error}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
