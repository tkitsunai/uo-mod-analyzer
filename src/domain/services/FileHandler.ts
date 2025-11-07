import type { IFileService } from "../../infrastructure/storage/FileService";

export class FileHandler {
  private fileService: IFileService;

  constructor(fileService: IFileService) {
    this.fileService = fileService;
  }

  async createImagePreview(file: File): Promise<string> {
    try {
      return await this.fileService.readAsDataURL(file);
    } catch (error) {
      console.error("画像プレビューの生成に失敗しました:", error);
      throw new Error("画像プレビューの生成に失敗しました");
    }
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith("image/");
  }

  isValidFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  async resizeImageForOcr(
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 1200
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // 元の画像サイズ
        const { width, height } = img;

        // リサイズが必要かチェック
        if (width <= maxWidth && height <= maxHeight) {
          resolve(file); // リサイズ不要
          return;
        }

        // アスペクト比を保持してリサイズ
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        const newWidth = width * ratio;
        const newHeight = height * ratio;

        canvas.width = newWidth;
        canvas.height = newHeight;

        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        // 画像を描画
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Blobに変換
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              console.log(
                `📐 Image resized: ${width}x${height} → ${Math.round(newWidth)}x${Math.round(
                  newHeight
                )} (${Math.round(file.size / 1024)}KB → ${Math.round(resizedFile.size / 1024)}KB)`
              );
              resolve(resizedFile);
            } else {
              reject(new Error("Failed to resize image"));
            }
          },
          file.type,
          0.8
        ); // 80%品質で圧縮
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }
}
