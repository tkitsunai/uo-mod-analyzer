import React, { useState, useEffect } from "react";
import type { CsvExportOptions } from "../../../domain/entities/CsvExportOptions";
import { defaultCsvExportOptions } from "../../../domain/entities/CsvExportOptions";

interface CsvExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: CsvExportOptions) => void;
  onCopy: (options: CsvExportOptions) => void;
  itemCount: number;
  className?: string;
}

export const CsvExportDialog: React.FC<CsvExportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  onCopy,
  itemCount,
  className = "",
}) => {
  const [options, setOptions] = useState<CsvExportOptions>(defaultCsvExportOptions);

  // Escキーでダイアログを閉じる
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExport = () => {
    onExport(options);
    onClose();
  };

  const handleCopy = async () => {
    try {
      await onCopy(options);
      onClose();
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className={`csv-export-dialog-overlay ${className}`}>
      <div className="csv-export-dialog">
        <div className="csv-export-dialog-header">
          <h3>CSV出力設定</h3>
          <button
            type="button"
            className="csv-export-dialog-close"
            onClick={onClose}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        <div className="csv-export-dialog-content">
          <div className="export-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.includeHeaders}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, includeHeaders: e.target.checked }))
                }
              />
              ヘッダー行を含める
            </label>
          </div>

          <div className="export-info">
            <p>出力対象: {itemCount}件のアイテム</p>
          </div>
        </div>

        <div className="csv-export-dialog-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            キャンセル
          </button>
          <button className="btn btn-primary" onClick={handleCopy}>
            📋 クリップボードにコピー
          </button>
          <button className="btn btn-success" onClick={handleExport}>
            📥 CSVファイルをダウンロード
          </button>
        </div>
      </div>
    </div>
  );
};
