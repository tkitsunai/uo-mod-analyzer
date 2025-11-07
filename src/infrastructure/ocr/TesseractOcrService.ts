import Tesseract from "tesseract.js";

export interface OcrResult {
  text: string;
  confidence: number;
}

export interface IOcrService {
  recognizeText(file: File): Promise<OcrResult>;
}

export class TesseractOcrService implements IOcrService {
  async recognizeText(file: File): Promise<OcrResult> {
    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (info) => {
          if (info.status === "recognizing text") {
            console.log(`OCR進捗: ${Math.round(info.progress * 100)}%`);
          }
        },
      });

      return {
        text: result.data.text,
        confidence: result.data.confidence,
      };
    } catch (error) {
      console.error("OCR処理エラー:", error);
      throw new Error("画像の解析に失敗しました。");
    }
  }
}
