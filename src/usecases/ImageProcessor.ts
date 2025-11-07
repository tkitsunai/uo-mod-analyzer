import type { ModEntry } from "../domain/entities/ModEntry";
import { ModDataExtractor } from "../domain/services/ModDataExtractor";
import type { IOcrService } from "../infrastructure/ocr/TesseractOcrService";
import { FileHandler } from "../domain/services/FileHandler";
import { FileService } from "../infrastructure/storage/FileService";

export interface ImageProcessingResult {
  ocrText: string;
  modEntries: ModEntry[];
  confidence: number;
}

export class ImageProcessor {
  private ocrService: IOcrService;
  private fileHandler: FileHandler;

  constructor(ocrService: IOcrService) {
    this.ocrService = ocrService;
    this.fileHandler = new FileHandler(new FileService());
  }

  async processImage(file: File): Promise<ImageProcessingResult> {
    try {
      // 大きな画像はOCR処理前にリサイズ
      let processedFile = file;
      if (file.size > 2 * 1024 * 1024) {
        console.log("🔄 Resizing large image for OCR:", `${Math.round(file.size / 1024 / 1024)}MB`);
        processedFile = await this.fileHandler.resizeImageForOcr(file);
      }

      const ocrResult = await this.ocrService.recognizeText(processedFile);
      const modEntries = ModDataExtractor.extractMods(ocrResult.text);

      console.log("🎯 OCR completed:", `${modEntries.length} mods found`);
      return {
        ocrText: ocrResult.text,
        modEntries,
        confidence: ocrResult.confidence,
      };
    } catch (error) {
      console.error("❌ Image processing error:", error);
      throw new Error("画像の解析に失敗しました。");
    }
  }
}
