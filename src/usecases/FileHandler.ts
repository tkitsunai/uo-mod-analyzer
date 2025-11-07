import type { IFileService } from "../infrastructure/storage/FileService";

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
}
