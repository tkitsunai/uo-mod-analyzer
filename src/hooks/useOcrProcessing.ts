import { useState, useCallback, useMemo } from "react";
import type { ModEntry } from "../domain/entities/ModEntry";
import { ImageProcessor } from "../usecases/ImageProcessor";
import { TesseractOcrService } from "../infrastructure/ocr/TesseractOcrService";
import { ItemNameEstimationUseCase } from "../usecases/ItemNameEstimationUseCase";
import type { ItemNameEstimation } from "../domain/services/RefactoredItemNameEstimator";

export const useOcrProcessing = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrText, setOcrText] = useState<string>("");
  const [modEntries, setModEntries] = useState<ModEntry[]>([]);
  const [estimatedName, setEstimatedName] = useState<ItemNameEstimation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imageProcessor = useMemo(() => new ImageProcessor(new TesseractOcrService()), []);
  const nameEstimationUseCase = useMemo(() => new ItemNameEstimationUseCase(), []);

  const processImage = useCallback(
    async (file: File) => {
      if (!file) return;

      setIsProcessing(true);
      setError(null);
      setOcrText("");
      setModEntries([]);

      try {
        const result = await imageProcessor.processImage(file);

        setOcrText(result.ocrText);
        setModEntries(result.modEntries);

        // アイテム名を推定
        const nameEstimation = await nameEstimationUseCase.estimateItemName({
          ocrText: result.ocrText,
          modEntries: result.modEntries,
        });
        setEstimatedName(nameEstimation);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "画像の解析に失敗しました";
        setError(errorMessage);
        console.error("OCR処理エラー:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [imageProcessor]
  );

  const resetOcrResults = useCallback(() => {
    setOcrText("");
    setModEntries([]);
    setEstimatedName(null);
    setError(null);
  }, []);

  return {
    isProcessing,
    ocrText,
    modEntries,
    estimatedName,
    error,
    processImage,
    resetOcrResults,
  };
};
