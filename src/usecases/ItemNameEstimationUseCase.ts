import type { ModEntry } from "../domain/entities/ModEntry";
import {
  RefactoredItemNameEstimator,
  type ItemNameEstimation,
} from "../domain/services/RefactoredItemNameEstimator";

export interface EstimateItemNameRequest {
  ocrText: string;
  modEntries: ModEntry[];
}

/**
 * アイテム名推定のユースケース
 * ビジネスルールの調整とドメインサービスの呼び出しを担当
 */
export class ItemNameEstimationUseCase {
  /**
   * アイテム名を推定する
   */
  async estimateItemName(request: EstimateItemNameRequest): Promise<ItemNameEstimation> {
    const { ocrText, modEntries } = request;

    // バリデーション
    if (!ocrText && modEntries.length === 0) {
      return {
        suggestedName: "",
        confidence: 0,
        source: "fallback",
      };
    }

    // ドメインサービスに委譲
    const estimation = RefactoredItemNameEstimator.estimateItemName(ocrText, modEntries);

    // ビジネスルール: 最低信頼度のチェック
    if (estimation.confidence < 0.1) {
      return {
        suggestedName: `アイテム ${new Date().toLocaleString("ja-JP", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        confidence: 0.1,
        source: "fallback",
      };
    }

    return estimation;
  }

  /**
   * 推定結果が自動入力に適しているかを判定
   */
  shouldAutoFill(estimation: ItemNameEstimation): boolean {
    // ビジネスルール: 信頼度30%以上で自動入力
    return estimation.confidence >= 0.3;
  }

  /**
   * 推定ソースの優先度を取得
   */
  getSourcePriority(source: ItemNameEstimation["source"]): number {
    const priorities = {
      ocr: 3, // 最高優先度
      mods: 2, // 中優先度
      fallback: 1, // 最低優先度
    };
    return priorities[source];
  }
}
