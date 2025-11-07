import React, { useState, useMemo } from "react";
import type { AnalyzedItem } from "../../../domain/entities/AnalyzedItem";
import { ItemCard } from "./ItemCard";
import { HistoryPanelHeader } from "./HistoryPanelHeader";
import { useHistoryFilters } from "../../../hooks/useHistoryFilters";
import { CsvExportUseCase } from "../../../usecases/CsvExportUseCase";
import { defaultCsvExportOptions } from "../../../domain/entities/CsvExportOptions";

interface ItemHistoryPanelProps {
  items: AnalyzedItem[];
  isLoading: boolean;
  error: string | null;
  onDeleteItem: (id: string) => void;
  onUpdateItemName: (id: string, name: string) => void;
  onClearAll: () => void;
  onShowMessage?: (message: string, type: "success" | "error" | "info", duration?: number) => void;
  className?: string;
}

export const ItemHistoryPanel: React.FC<ItemHistoryPanelProps> = ({
  items,
  isLoading,
  error,
  onDeleteItem,
  onUpdateItemName,
  onClearAll,
  onShowMessage,
  className = "",
}) => {
  const [previewItem, setPreviewItem] = useState<AnalyzedItem | null>(null);

  const { filteredItems, statistics, handleSearch, handleSort } = useHistoryFilters({ items });

  const csvExportUseCase = useMemo(() => new CsvExportUseCase(), []);

  const handlePreview = (item: AnalyzedItem) => {
    setPreviewItem(item);
  };

  const closePreview = () => {
    setPreviewItem(null);
  };

  const handleExportCSV = async () => {
    if (filteredItems.length === 0) return;
    await csvExportUseCase.exportToFile(filteredItems, defaultCsvExportOptions);
  };

  const handleCopyCSV = async () => {
    if (filteredItems.length === 0) return;
    try {
      await csvExportUseCase.copyToClipboard(filteredItems, defaultCsvExportOptions);
      onShowMessage?.("📋 履歴データをクリップボードにコピーしました", "success", 3000);
    } catch (error) {
      onShowMessage?.("❌ クリップボードへのコピーに失敗しました", "error", 3000);
    }
  };

  if (isLoading) {
    return (
      <div className={`history-panel ${className}`}>
        <HistoryPanelHeader
          itemCount={0}
          onSearch={() => {}}
          onSort={() => {}}
          onClearAll={onClearAll}
          onExportCSV={handleExportCSV}
          onCopyCSV={handleCopyCSV}
        />
        <div className="loading-state">
          <p>履歴を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`history-panel ${className}`}>
        <HistoryPanelHeader
          itemCount={0}
          onSearch={() => {}}
          onSort={() => {}}
          onClearAll={onClearAll}
          onExportCSV={handleExportCSV}
          onCopyCSV={handleCopyCSV}
        />
        <div className="error-state" style={{ color: "red", padding: "16px" }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`history-panel ${className}`}>
      <HistoryPanelHeader
        itemCount={statistics.totalItems}
        onSearch={handleSearch}
        onSort={handleSort}
        onClearAll={onClearAll}
        onExportCSV={handleExportCSV}
        onCopyCSV={handleCopyCSV}
      />

      <div className="panel-content">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h4>履歴がありません</h4>
            <p>画像を解析して「履歴に追加」してください</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h4>検索結果がありません</h4>
            <p>検索条件を変更してください</p>
          </div>
        ) : (
          <>
            {statistics.filteredItems !== statistics.totalItems && (
              <div className="filter-info">
                {statistics.filteredItems}件中{statistics.totalItems}件を表示
              </div>
            )}

            <div className="items-list">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onDelete={onDeleteItem}
                  onUpdateName={onUpdateItemName}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 画像プレビューモーダル */}
      {previewItem && (
        <div className="preview-modal" onClick={closePreview}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>{previewItem.name}</h3>
              <button className="close-btn" onClick={closePreview}>
                ❌
              </button>
            </div>
            {previewItem.imageUrl && (
              <img src={previewItem.imageUrl} alt={previewItem.name} className="preview-image" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
