import type { AnalyzedItem } from "../../domain/entities/AnalyzedItem";
import type { IItemStorage } from "../../domain/services/ItemHistoryManager";

export class LocalStorageItemStorage implements IItemStorage {
  private readonly STORAGE_KEY = "uo-mod-analyzer-items";

  async save(items: AnalyzedItem[]): Promise<void> {
    try {
      const serializedItems = items.map((item) => ({
        ...item,
        analyzedAt: item.analyzedAt.toISOString(),
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializedItems));
    } catch (error) {
      console.error("アイテム履歴の保存に失敗しました:", error);
      throw new Error("履歴の保存に失敗しました");
    }
  }

  async load(): Promise<AnalyzedItem[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        analyzedAt: new Date(item.analyzedAt),
      }));
    } catch (error) {
      console.error("アイテム履歴の読み込みに失敗しました:", error);
      return [];
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error("アイテム履歴のクリアに失敗しました:", error);
      throw new Error("履歴のクリアに失敗しました");
    }
  }
}
