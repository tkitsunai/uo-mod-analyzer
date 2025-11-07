import type { ItemNameCandidate } from "./OcrTextParser";
import type { ValidationResult } from "./TextValidator";

/**
 * アイテム名推定の信頼度を計算するドメインサービス
 */
export class ConfidenceCalculator {
  /**
   * OCRベースの推定信頼度を計算
   */
  static calculateOcrConfidence(
    candidate: ItemNameCandidate,
    validation: ValidationResult
  ): number {
    if (!validation.isValid) {
      return 0;
    }

    let baseConfidence = 0;

    // 位置による基本信頼度
    switch (candidate.priority) {
      case "primary":
        baseConfidence = 0.9; // 1行目は高信頼度
        break;
      case "secondary":
        baseConfidence = 0.7; // 2-3行目は中信頼度
        break;
      default:
        baseConfidence = 0.4;
    }

    // テキスト品質による調整
    const textQualityBonus = this.calculateTextQuality(validation.cleanedText);

    return Math.min(baseConfidence + textQualityBonus, 1.0);
  }

  /**
   * OCRベースの詳細な信頼度計算（透明性向上版）
   */
  static calculateOcrConfidenceWithDetails(
    candidate: ItemNameCandidate,
    validation: ValidationResult
  ): ConfidenceCalculationDetails {
    const adjustments: ConfidenceAdjustment[] = [];

    if (!validation.isValid) {
      return {
        source: "ocr",
        baseScore: 0,
        adjustments: [{ type: "validation", value: 0, reason: `Invalid: ${validation.reason}` }],
        finalScore: 0,
        metadata: { candidate, validation },
      };
    }

    // 位置による基本信頼度
    let baseScore = 0;
    switch (candidate.priority) {
      case "primary":
        baseScore = 0.9;
        adjustments.push({
          type: "position",
          value: 0.9,
          reason: "First line (primary candidate)",
        });
        break;
      case "secondary":
        baseScore = 0.7;
        adjustments.push({
          type: "position",
          value: 0.7,
          reason: "2nd-3rd line (secondary candidate)",
        });
        break;
      default:
        baseScore = 0.4;
        adjustments.push({ type: "position", value: 0.4, reason: "Lower position" });
    }

    // テキスト品質による調整
    const textQualityBonus = this.calculateTextQualityWithDetails(validation.cleanedText);
    if (textQualityBonus.score > 0) {
      adjustments.push({
        type: "text_quality",
        value: textQualityBonus.score,
        reason: textQualityBonus.reasons.join(", "),
      });
    }

    const finalScore = Math.min(baseScore + textQualityBonus.score, 1.0);

    return {
      source: "ocr",
      baseScore,
      adjustments,
      finalScore,
      metadata: {
        candidate,
        validation,
        textQualityDetails: textQualityBonus,
      },
    };
  }

  /**
   * フォールバック名の信頼度を計算
   */
  static calculateFallbackConfidence(modCount: number): number {
    if (modCount === 0) {
      return 0.2; // MODがない場合の最低信頼度
    }

    return 0.3; // MODがある場合のフォールバック信頼度
  }

  /**
   * フォールバックの詳細な信頼度計算
   */
  static calculateFallbackConfidenceWithDetails(modCount: number): ConfidenceCalculationDetails {
    const adjustments: ConfidenceAdjustment[] = [];
    let finalScore: number;

    if (modCount === 0) {
      finalScore = 0.2;
      adjustments.push({
        type: "fallback_base",
        value: 0.2,
        reason: "No MODs - minimum fallback confidence",
      });
    } else {
      finalScore = 0.3;
      adjustments.push({
        type: "fallback_base",
        value: 0.3,
        reason: `${modCount} MODs available - standard fallback confidence`,
      });
    }

    return {
      source: "fallback",
      baseScore: finalScore,
      adjustments,
      finalScore,
      metadata: { modCount, isFallback: true },
    };
  }

  /**
   * テキストの品質スコアを計算
   */
  private static calculateTextQuality(text: string): number {
    let quality = 0;

    // 長さのスコア（適度な長さが良い）
    const length = text.length;
    if (length >= 3 && length <= 30) {
      quality += 0.1;
    }

    // 英数字バランス（英字が多い方が良い）
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
    const letterRatio = letterCount / length;
    if (letterRatio > 0.6) {
      quality += 0.05;
    }

    // 特殊文字の少なさ
    const specialCharCount = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    if (specialCharCount === 0) {
      quality += 0.05;
    }

    return quality;
  }

  /**
   * テキスト品質スコアを詳細情報付きで計算
   */
  private static calculateTextQualityWithDetails(text: string): {
    score: number;
    reasons: string[];
  } {
    let score = 0;
    const reasons: string[] = [];

    // 長さのスコア（適度な長さが良い）
    const length = text.length;
    if (length >= 3 && length <= 30) {
      score += 0.1;
      reasons.push(`Good length (${length} chars): +0.1`);
    } else {
      reasons.push(`Length ${length} chars: no bonus`);
    }

    // 英数字バランス（英字が多い方が良い）
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
    const letterRatio = letterCount / length;
    if (letterRatio > 0.6) {
      score += 0.05;
      reasons.push(`High letter ratio (${Math.round(letterRatio * 100)}%): +0.05`);
    } else {
      reasons.push(`Letter ratio ${Math.round(letterRatio * 100)}%: no bonus`);
    }

    // 特殊文字の少なさ
    const specialCharCount = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    if (specialCharCount === 0) {
      score += 0.05;
      reasons.push("No special characters: +0.05");
    } else {
      reasons.push(`${specialCharCount} special characters: no bonus`);
    }

    return { score, reasons };
  }

  /**
   * 複数の推定結果から最適なものを選択
   */
  static selectBestEstimation(estimations: ConfidenceEstimation[]): ConfidenceEstimation | null {
    if (estimations.length === 0) {
      return null;
    }

    // 信頼度が最も高いものを選択
    return estimations.reduce((best, current) =>
      current.confidence > best.confidence ? current : best
    );
  }

  /**
   * 詳細な選択ロジック（デバッグ用）
   */
  static selectBestEstimationWithDetails(calculations: ConfidenceCalculationDetails[]): {
    selected: ConfidenceCalculationDetails | null;
    comparison: Array<{ source: string; score: number; reason: string }>;
  } {
    if (calculations.length === 0) {
      return { selected: null, comparison: [] };
    }

    const comparison = calculations.map((calc) => ({
      source: calc.source,
      score: calc.finalScore,
      reason: `${calc.adjustments.length} adjustments, final: ${Math.round(
        calc.finalScore * 100
      )}%`,
    }));

    const selected = calculations.reduce((best, current) =>
      current.finalScore > best.finalScore ? current : best
    );

    return { selected, comparison };
  }

  /**
   * 信頼度計算の詳細レポートを生成
   */
  static generateConfidenceReport(calculations: ConfidenceCalculationDetails[]): string {
    if (calculations.length === 0) {
      return "No calculations available";
    }

    const lines = ["🔍 Confidence Calculation Report", "=".repeat(40)];

    calculations.forEach((calc, index) => {
      lines.push(`\n${index + 1}. ${calc.source.toUpperCase()} Method:`);
      lines.push(`   Base Score: ${Math.round(calc.baseScore * 100)}%`);

      calc.adjustments.forEach((adj) => {
        const sign = adj.value >= 0 ? "+" : "";
        lines.push(`   ${adj.type}: ${sign}${Math.round(adj.value * 100)}% (${adj.reason})`);
      });

      lines.push(`   Final Score: ${Math.round(calc.finalScore * 100)}%`);
    });

    const best = calculations.reduce((best, current) =>
      current.finalScore > best.finalScore ? current : best
    );

    lines.push(
      `\n🏆 Selected: ${best.source.toUpperCase()} (${Math.round(best.finalScore * 100)}%)`
    );

    return lines.join("\n");
  }
}

export interface ConfidenceEstimation {
  suggestedName: string;
  confidence: number;
  source: "ocr" | "mods" | "fallback";
  details?: {
    textQuality?: number;
    validationResult?: ValidationResult;
  };
}

/**
 * 信頼度計算の詳細情報を記録するインターフェース
 */
export interface ConfidenceCalculationDetails {
  source: "ocr" | "mods" | "fallback";
  baseScore: number;
  adjustments: ConfidenceAdjustment[];
  finalScore: number;
  metadata: Record<string, any>;
}

export interface ConfidenceAdjustment {
  type: string;
  value: number;
  reason: string;
}
