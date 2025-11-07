import type { ModEntry } from "../entities/ModEntry";
import { OcrTextParser } from "./OcrTextParser";
import { TextValidator } from "./TextValidator";
import { ConfidenceCalculator, type ConfidenceEstimation } from "./ConfidenceCalculator";

export interface ItemNameEstimation {
  suggestedName: string;
  confidence: number;
  source: "ocr" | "mods" | "fallback";
}

/**
 * 責務を分離した新しいアイテム名推定サービス
 * 各専門サービスを統合してアイテム名を推定する
 */
export class RefactoredItemNameEstimator {
  /**
   * OCRテキストとMOD情報からアイテム名を推定
   * シンプルな2段階フォールバック: OCR → タイムスタンプ
   */
  static estimateItemName(ocrText: string, modEntries: ModEntry[]): ItemNameEstimation {
    // 1. OCRベースの推定（最優先）
    const ocrEstimation = this.estimateFromOcr(ocrText);
    if (ocrEstimation) {
      return {
        suggestedName: ocrEstimation.suggestedName,
        confidence: ocrEstimation.confidence,
        source: "ocr",
      };
    }

    // 2. フォールバック推定（タイムスタンプベース）
    const fallbackEstimation = this.createFallbackEstimation(modEntries);
    return {
      suggestedName: fallbackEstimation.suggestedName,
      confidence: fallbackEstimation.confidence,
      source: "fallback",
    };
  }

  /**
   * OCRテキストからアイテム名を推定
   */
  private static estimateFromOcr(ocrText: string): ConfidenceEstimation | null {
    const lines = OcrTextParser.parseLines(ocrText);
    if (lines.length === 0) {
      return null;
    }

    const candidates = OcrTextParser.extractItemNameCandidates(lines);

    for (const candidate of candidates) {
      const validation = TextValidator.isViableItemNameCandidate(candidate.text);

      if (validation.isValid) {
        const confidence = ConfidenceCalculator.calculateOcrConfidence(candidate, validation);

        return {
          suggestedName: validation.cleanedText,
          confidence,
          source: "ocr",
          details: {
            validationResult: validation,
          },
        };
      }
    }

    return null;
  }

  /**
   * フォールバック名を生成（タイムスタンプベース）
   */
  private static createFallbackEstimation(modEntries: ModEntry[]): ConfidenceEstimation {
    const modCount = modEntries.length;
    const confidence = ConfidenceCalculator.calculateFallbackConfidence(modCount);

    const timestamp = new Date().toLocaleString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const suggestedName =
      modCount === 0 ? `アイテム ${timestamp}` : `${modCount}MODアイテム ${timestamp}`;

    return {
      suggestedName,
      confidence,
      source: "fallback",
    };
  }
}
