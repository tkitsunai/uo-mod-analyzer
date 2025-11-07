import { useEffect } from "react";
import type { ItemNameEstimation } from "../domain/services/RefactoredItemNameEstimator";

interface UseAutoItemNameProps {
  estimatedName: ItemNameEstimation | null;
  onNameSet: (name: string) => void;
}

/**
 * アイテム名の自動入力を管理するフック
 */
export const useAutoItemName = ({ estimatedName, onNameSet }: UseAutoItemNameProps) => {
  useEffect(() => {
    if (estimatedName?.suggestedName && estimatedName.confidence >= 0.3) {
      onNameSet(estimatedName.suggestedName);
    }
  }, [estimatedName, onNameSet]);
};
