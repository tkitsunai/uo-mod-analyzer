import { useState, useEffect, useCallback, useMemo } from "react";
import type { AnalyzedItem } from "../domain/entities/AnalyzedItem";
import type { ModEntry } from "../domain/entities/ModEntry";
import { ItemHistoryUseCase } from "../usecases/ItemHistoryUseCase";
import { ItemHistoryManager } from "../domain/services/ItemHistoryManager";
import { LocalStorageItemStorage } from "../infrastructure/storage/LocalStorageItemStorage";

export const useItemHistory = () => {
  const [items, setItems] = useState<AnalyzedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const historyUseCase = useMemo(
    () => new ItemHistoryUseCase(new ItemHistoryManager(new LocalStorageItemStorage())),
    []
  );

  const refreshItems = useCallback(() => {
    setItems(historyUseCase.getItems());
  }, [historyUseCase]);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        await historyUseCase.initialize();
        refreshItems();
      } catch (err) {
        setError("履歴の読み込みに失敗しました");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [historyUseCase, refreshItems]);

  const addItem = useCallback(
    async (
      name: string,
      modEntries: ModEntry[],
      ocrText: string,
      confidence: number,
      imageUrl?: string
    ) => {
      try {
        setError(null);
        await historyUseCase.addItem({
          name,
          modEntries,
          ocrText,
          confidence,
          imageUrl,
        });
        refreshItems();
      } catch (err) {
        setError("アイテムの追加に失敗しました");
        console.error(err);
      }
    },
    [historyUseCase, refreshItems]
  );

  const removeItem = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await historyUseCase.removeItem(id);
        refreshItems();
      } catch (err) {
        setError("アイテムの削除に失敗しました");
        console.error(err);
      }
    },
    [historyUseCase, refreshItems]
  );

  const updateItemName = useCallback(
    async (id: string, name: string) => {
      try {
        setError(null);
        await historyUseCase.updateItemName(id, name);
        refreshItems();
      } catch (err) {
        setError("アイテム名の更新に失敗しました");
        console.error(err);
      }
    },
    [historyUseCase, refreshItems]
  );

  const clearAll = useCallback(async () => {
    try {
      setError(null);
      await historyUseCase.clearAllItems();
      refreshItems();
    } catch (err) {
      setError("履歴のクリアに失敗しました");
      console.error(err);
    }
  }, [historyUseCase, refreshItems]);

  const getAllModEntries = useCallback(() => {
    return historyUseCase.getAllModEntries();
  }, [historyUseCase]);

  return {
    items,
    itemCount: items.length,
    isLoading,
    error,
    addItem,
    removeItem,
    updateItemName,
    clearAll,
    getAllModEntries,
    refreshItems,
  };
};
