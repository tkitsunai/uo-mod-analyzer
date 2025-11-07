import { useState, useCallback } from "react";
import { FileHandler } from "../usecases/FileHandler";
import { FileService } from "../infrastructure/storage/FileService";

export const useImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileHandler = new FileHandler(new FileService());

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      if (!fileHandler.isImageFile(file)) {
        setError("画像ファイルを選択してください");
        return;
      }

      if (!fileHandler.isValidFileSize(file)) {
        setError("ファイルサイズが大きすぎます（10MB以下にしてください）");
        return;
      }

      try {
        const preview = await fileHandler.createImagePreview(file);

        setSelectedFile(file);
        setImagePreview(preview);
      } catch (err) {
        setError("画像プレビューの生成に失敗しました");
        console.error(err);
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
