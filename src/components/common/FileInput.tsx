import React from "react";

interface FileInputProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFileName?: string;
  accept?: string;
  className?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
  onFileSelect,
  selectedFileName,
  accept = "image/*",
  className = "",
}) => {
  return (
    <div className={`upload-section ${className}`}>
      <label htmlFor="file-input" className="file-label">
        画像ファイルを選択
      </label>
      <input
        id="file-input"
        type="file"
        accept={accept}
        onChange={onFileSelect}
        className="file-input"
      />
      <div className="paste-info">
        <p>
          または、画像をコピーして <kbd>Ctrl+V</kbd> で貼り付け
        </p>
      </div>
      {selectedFileName && <p className="file-info">選択されたファイル: {selectedFileName}</p>}
    </div>
  );
};
