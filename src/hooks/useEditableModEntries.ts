import { useState, useCallback, useMemo } from "react";
import type { ModEntry } from "../domain/entities/ModEntry";
import { ModEntryUpdateUseCase } from "../usecases/ModEntryUpdateUseCase";
import { useMessage } from "./useMessage";

export interface UseEditableModEntriesResult {
  modEntries: ModEntry[];
  updateModEntry: (index: number, field: keyof ModEntry, value: string) => boolean;
  deleteModEntry: (index: number) => boolean;
  addModEntry: (newEntry?: Partial<ModEntry>) => boolean;
  resetModEntries: (entries: ModEntry[]) => void;
  hasChanges: boolean;
}

/**
 * 編集可能なMODエントリの状態管理を行うカスタムフック
 */
export const useEditableModEntries = (
  initialEntries: ModEntry[] = []
): UseEditableModEntriesResult => {
  const [modEntries, setModEntries] = useState<ModEntry[]>(initialEntries);
  const [originalEntries] = useState<ModEntry[]>(initialEntries);
  const { showMessage } = useMessage();

  // UseCase インスタンス
  const updateUseCase = useMemo(() => new ModEntryUpdateUseCase(), []);

  /**
   * MODエントリを更新
   */
  const updateModEntry = useCallback(
    (index: number, field: keyof ModEntry, value: string): boolean => {
      const result = updateUseCase.updateModEntry(modEntries, index, field, value);

      if (result.success) {
        setModEntries(result.updatedEntries);
        return true;
      } else {
        if (result.error) {
          showMessage(result.error, "error", 3000);
        }
        return false;
      }
    },
    [modEntries, updateUseCase, showMessage]
  );

  /**
   * MODエントリを削除
   */
  const deleteModEntry = useCallback(
    (index: number): boolean => {
      const result = updateUseCase.deleteModEntry(modEntries, index);

      if (result.success) {
        setModEntries(result.updatedEntries);
        showMessage("MODエントリを削除しました", "success", 2000);
        return true;
      } else {
        if (result.error) {
          showMessage(result.error, "error", 3000);
        }
        return false;
      }
    },
    [modEntries, updateUseCase, showMessage]
  );

  /**
   * 新しいMODエントリを追加
   */
  const addModEntry = useCallback(
    (newEntry?: Partial<ModEntry>): boolean => {
      const defaultEntry: ModEntry = {
        mod: newEntry?.mod || "New Mod",
        value: newEntry?.value || "0",
      };

      const result = updateUseCase.addModEntry(modEntries, defaultEntry);

      if (result.success) {
        setModEntries(result.updatedEntries);
        showMessage("MODエントリを追加しました", "success", 2000);
        return true;
      } else {
        if (result.error) {
          showMessage(result.error, "error", 3000);
        }
        return false;
      }
    },
    [modEntries, updateUseCase, showMessage]
  );

  /**
   * MODエントリをリセット
   */
  const resetModEntries = useCallback(
    (entries: ModEntry[]) => {
      const result = updateUseCase.validateModEntries(entries);

      if (result.success) {
        setModEntries(result.updatedEntries);
      } else {
        if (result.error) {
          showMessage(result.error, "error", 3000);
        }
        setModEntries(entries); // バリデーション失敗でも設定する
      }
    },
    [updateUseCase, showMessage]
  );

  /**
   * 変更があるかどうかを判定
   */
  const hasChanges = useMemo(() => {
    if (modEntries.length !== originalEntries.length) {
      return true;
    }

    return modEntries.some((entry, index) => {
      const original = originalEntries[index];
      return !original || entry.mod !== original.mod || entry.value !== original.value;
    });
  }, [modEntries, originalEntries]);

  return {
    modEntries,
    updateModEntry,
    deleteModEntry,
    addModEntry,
    resetModEntries,
    hasChanges,
  };
};
