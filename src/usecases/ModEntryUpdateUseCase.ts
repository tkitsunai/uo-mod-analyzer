import type { ModEntry } from "../domain/entities/ModEntry";
import { isValidModEntry } from "../domain/entities/ModEntry";

export interface UpdateModEntryRequest {
  entries: ModEntry[];
}

export interface ModEntryUpdateResult {
  success: boolean;
  updatedEntries: ModEntry[];
  error?: string;
}

/**
 * MOD エントリの更新処理を担当するユースケース
 * バリデーションとビジネスルールを適用
 */
export class ModEntryUpdateUseCase {
  /**
   * MOD エントリリストを更新
   */
  updateModEntry(
    entries: ModEntry[],
    index: number,
    field: keyof ModEntry,
    value: string
  ): ModEntryUpdateResult {
    try {
      if (index < 0 || index >= entries.length) {
        return {
          success: false,
          updatedEntries: entries,
          error: "無効なインデックスです",
        };
      }

      const trimmedValue = value.trim();
      if (!trimmedValue) {
        return {
          success: false,
          updatedEntries: entries,
          error: "空の値は設定できません",
        };
      }

      const updatedEntries = [...entries];
      const updatedEntry = { ...updatedEntries[index] };
      updatedEntry[field] = trimmedValue;

      // バリデーション
      if (!isValidModEntry(updatedEntry)) {
        return {
          success: false,
          updatedEntries: entries,
          error: "無効なMODエントリです",
        };
      }

      updatedEntries[index] = updatedEntry;

      return {
        success: true,
        updatedEntries,
      };
    } catch (error) {
      console.error("MODエントリの更新に失敗しました:", error);
      return {
        success: false,
        updatedEntries: entries,
        error: "MODエントリの更新に失敗しました",
      };
    }
  }

  /**
   * MOD エントリを削除
   */
  deleteModEntry(entries: ModEntry[], index: number): ModEntryUpdateResult {
    try {
      if (index < 0 || index >= entries.length) {
        return {
          success: false,
          updatedEntries: entries,
          error: "無効なインデックスです",
        };
      }

      const updatedEntries = entries.filter((_, i) => i !== index);

      return {
        success: true,
        updatedEntries,
      };
    } catch (error) {
      console.error("MODエントリの削除に失敗しました:", error);
      return {
        success: false,
        updatedEntries: entries,
        error: "MODエントリの削除に失敗しました",
      };
    }
  }

  /**
   * 新しい MOD エントリを追加
   */
  addModEntry(entries: ModEntry[], newEntry: ModEntry): ModEntryUpdateResult {
    try {
      if (!isValidModEntry(newEntry)) {
        return {
          success: false,
          updatedEntries: entries,
          error: "無効なMODエントリです",
        };
      }

      const updatedEntries = [...entries, newEntry];

      return {
        success: true,
        updatedEntries,
      };
    } catch (error) {
      console.error("MODエントリの追加に失敗しました:", error);
      return {
        success: false,
        updatedEntries: entries,
        error: "MODエントリの追加に失敗しました",
      };
    }
  }

  /**
   * MOD エントリリスト全体を検証
   */
  validateModEntries(entries: ModEntry[]): ModEntryUpdateResult {
    try {
      const validEntries = entries.filter(isValidModEntry);

      if (validEntries.length !== entries.length) {
        console.warn(
          `${entries.length - validEntries.length}個の無効なMODエントリが除外されました`
        );
      }

      return {
        success: true,
        updatedEntries: validEntries,
      };
    } catch (error) {
      console.error("MODエントリの検証に失敗しました:", error);
      return {
        success: false,
        updatedEntries: entries,
        error: "MODエントリの検証に失敗しました",
      };
    }
  }
}
