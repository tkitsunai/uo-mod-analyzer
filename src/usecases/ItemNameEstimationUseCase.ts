import type { ModEntry } from "../domain/entities/ModEntry";
import {
  RefactoredItemNameEstimator,
  type ItemNameEstimation,
} from "../domain/services/RefactoredItemNameEstimator";

export interface EstimateItemNameRequest {
  ocrText: string;
  modEntries: ModEntry[];
}

export class ItemNameEstimationUseCase {
  async estimateItemName(request: EstimateItemNameRequest): Promise<ItemNameEstimation> {
    const { ocrText, modEntries } = request;

    if (!ocrText && modEntries.length === 0) {
      return {
        suggestedName: "",
        confidence: 0,
        source: "fallback",
      };
    }

    const estimation = RefactoredItemNameEstimator.estimateItemName(ocrText, modEntries);

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

  shouldAutoFill(estimation: ItemNameEstimation): boolean {
    return estimation.confidence >= 0.3;
  }

  getSourcePriority(source: ItemNameEstimation["source"]): number {
    const priorities = {
      ocr: 3,
      mods: 2,
      fallback: 1,
    };
    return priorities[source];
  }
}
