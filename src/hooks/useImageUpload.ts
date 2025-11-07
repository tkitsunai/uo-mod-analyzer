import { useState, useCallback, useMemo } from "react";
import { FileHandler } from "../domain/services/FileHandler";
import { FileService } from "../infrastructure/storage/FileService";

export const useImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileHandler = useMemo(() => new FileHandler(new FileService()), []);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      if (!fileHandler.isImageFile(file)) {
        const errorMsg = "画像ファイルを選択してください";
        console.error("❌ File validation failed - not an image:", file.type);
        setError(errorMsg);
        return;
      }

      if (!fileHandler.isValidFileSize(file)) {
        const errorMsg = "ファイルサイズが大きすぎます（10MB以下にしてください）";
        console.error(
          "❌ File validation failed - too large:",
          `${Math.round(file.size / 1024 / 1024)}MB`
        );
        setError(errorMsg);
        return;
      }

      try {
        const preview = await fileHandler.createImagePreview(file);
        setSelectedFile(file);
        setImagePreview(preview);
        console.log(
          "✅ File selection successful:",
          file.name,
          `${Math.round(file.size / 1024)}KB`
        );
      } catch (err) {
        const errorMsg = "画像プレビューの生成に失敗しました";
        setError(errorMsg);
        console.error("❌ Preview generation failed:", err);
      }
    },
    [fileHandler]
  );

  const resetFileSelection = useCallback(() => {
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);
  }, []);

  return {
    selectedFile,
    imagePreview,
    error,
    handleFileSelect,
    resetFileSelection,
  };
};
