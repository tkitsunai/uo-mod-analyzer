import { useCallback, useMemo } from "react";
import type { ModEntry } from "../domain/entities/ModEntry";
import { CsvExportUseCase } from "../usecases/CsvExportUseCase";
import { defaultCsvExportOptions } from "../domain/entities/CsvExportOptions";

export const useCsvExport = () => {
  const csvExportUseCase = useMemo(() => new CsvExportUseCase(), []);

  const exportModEntries = useCallback(
    async (modEntries: ModEntry[]) => {
      if (modEntries.length === 0) {
        console.warn("エクスポートするMODエントリがありません");
        return;
      }

      // ModEntry を AnalyzedItem 形式に変換
      const mockAnalyzedItem = {
        id: "temp",
        name: "Current Item",
        analyzedAt: new Date(),
        modEntries,
        ocrText: "",
        confidence: 0,
      };

      try {
        await csvExportUseCase.exportToFile([mockAnalyzedItem], {
          ...defaultCsvExportOptions,
          includeHeaders: true,
        });
      } catch (error) {
        console.error("CSV エクスポートに失敗しました:", error);
        throw new Error("CSV エクスポートに失敗しました");
      }
    },
    [csvExportUseCase]
  );

  const exportAllModEntries = useCallback(
    async (allModEntries: ModEntry[]) => {
      if (allModEntries.length === 0) {
        console.warn("エクスポートするMODエントリがありません");
        return;
      }

      // ModEntry を AnalyzedItem 形式に変換
      const mockAnalyzedItem = {
        id: "temp-all",
        name: "All Items Export",
        analyzedAt: new Date(),
        modEntries: allModEntries,
        ocrText: "",
        confidence: 0,
      };

      try {
        await csvExportUseCase.exportToFile([mockAnalyzedItem], {
          ...defaultCsvExportOptions,
          includeHeaders: true,
        });
      } catch (error) {
        console.error("全履歴 CSV エクスポートに失敗しました:", error);
        throw new Error("全履歴 CSV エクスポートに失敗しました");
      }
    },
    [csvExportUseCase]
  );

  const copyModEntries = useCallback(
    async (modEntries: ModEntry[]) => {
      if (modEntries.length === 0) {
        console.warn("コピーするMODエントリがありません");
        return;
      }

      // ModEntry を AnalyzedItem 形式に変換
      const mockAnalyzedItem = {
        id: "temp",
        name: "Current Item",
        analyzedAt: new Date(),
        modEntries,
        ocrText: "",
        confidence: 0,
      };

      try {
        await csvExportUseCase.copyToClipboard([mockAnalyzedItem], {
          ...defaultCsvExportOptions,
          includeHeaders: true,
        });
      } catch (error) {
        console.error("CSV クリップボードコピーに失敗しました:", error);
        throw new Error("CSV クリップボードコピーに失敗しました");
      }
    },
    [csvExportUseCase]
  );

  const copyAllModEntries = useCallback(
    async (allModEntries: ModEntry[]) => {
      if (allModEntries.length === 0) {
        console.warn("コピーするMODエントリがありません");
        return;
      }

      // ModEntry を AnalyzedItem 形式に変換
      const mockAnalyzedItem = {
        id: "temp-all",
        name: "All Items Export",
        analyzedAt: new Date(),
        modEntries: allModEntries,
        ocrText: "",
        confidence: 0,
      };

      try {
        await csvExportUseCase.copyToClipboard([mockAnalyzedItem], {
          ...defaultCsvExportOptions,
          includeHeaders: true,
        });
      } catch (error) {
        console.error("全履歴 CSV クリップボードコピーに失敗しました:", error);
        throw new Error("全履歴 CSV クリップボードコピーに失敗しました");
      }
    },
    [csvExportUseCase]
  );

  return {
    exportModEntries,
    exportAllModEntries,
    copyModEntries,
    copyAllModEntries,
  };
};
