import React from "react";
import { FileInput } from "../../common/FileInput";

interface ImageUploadAreaProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFileName?: string;
  error?: string | null;
}

export const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  onFileSelect,
  selectedFileName,
  error,
}) => {
  return (
    <div className="image-upload-area">
      <FileInput onFileSelect={onFileSelect} selectedFileName={selectedFileName} />
      {error && (
        <div className="error-message" style={{ color: "red", marginTop: "8px" }}>
          {error}
        </div>
      )}
    </div>
  );
};
