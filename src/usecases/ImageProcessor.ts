import type { ModEntry } from "../domain/entities/ModEntry";
import { ModExtractor } from "../domain/services/ModExtractor";
import type { IOcrService } from "../infrastructure/ocr/TesseractOcrService";

export interface ImageProcessingResult {
  ocrText: string;
  modEntries: ModEntry[];
  confidence: number;
}

export class ImageProcessor {
  private ocrService: IOcrService;

  constructor(ocrService: IOcrService) {
    this.ocrService = ocrService;
  }

  async processImage(file: File): Promise<ImageProcessingResult> {
    try {
      const ocrResult = await this.ocrService.recognizeText(file);
      const modEntries = ModExtractor.extractMods(ocrResult.text);

      return {
        ocrText: ocrResult.text,
        modEntries,
        confidence: ocrResult.confidence,
      };
    } catch (error) {
      console.error("画像処理エラー:", error);
      throw new Error("画像の解析に失敗しました。");
    }
  }
}
