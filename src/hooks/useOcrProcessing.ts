import { useState, useCallback } from "react";
import type { ModEntry } from "../domain/entities/ModEntry";
import { ImageProcessor } from "../usecases/ImageProcessor";
import { TesseractOcrService } from "../infrastructure/ocr/TesseractOcrService";

export const useOcrProcessing = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrText, setOcrText] = useState<string>("");
  const [modEntries, setModEntries] = useState<ModEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const imageProcessor = new ImageProcessor(new TesseractOcrService());

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
    setError(null);
  }, []);

  return {
    isProcessing,
    ocrText,
    modEntries,
    error,
    processImage,
    resetOcrResults,
  };
};
