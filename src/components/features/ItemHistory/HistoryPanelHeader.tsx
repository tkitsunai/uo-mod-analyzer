import React, { useState } from "react";
import { Button } from "../../common/Button";

interface HistoryPanelHeaderProps {
  itemCount: number;
  onSearch: (query: string) => void;
  onSort: (sortBy: "date" | "name" | "mods") => void;
  onClearAll: () => void;
  onExportCSV: () => void;
  onCopyCSV?: () => void;
  className?: string;
}

export const HistoryPanelHeader: React.FC<HistoryPanelHeaderProps> = ({
  itemCount,
  onSearch,
  onSort,
  onClearAll,
  onExportCSV,
  onCopyCSV,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "mods">("date");
  const [showActions, setShowActions] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSortChange = (newSortBy: "date" | "name" | "mods") => {
    setSortBy(newSortBy);
    onSort(newSortBy);
  };

  return (
    <div className={`history-panel-header ${className}`}>
      <div className="header-title">
        <h3>📋 解析履歴</h3>
        <div className="header-stats">
          <span className="stat-item">📦 {itemCount}件</span>
        </div>
      </div>

      {itemCount > 0 && (
        <>
          <div className="header-search">
            <input
              type="text"
              placeholder="アイテム名で検索..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <div className="sort-controls">
              <label htmlFor="sort-select">並び順:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as "date" | "name" | "mods")}
                className="sort-select"
              >
                <option value="date">📅 日時順</option>
                <option value="name">📝 名前順</option>
                <option value="mods">⚔️ MOD数順</option>
              </select>
            </div>
          </div>

          <div className="header-actions">
            <Button
              onClick={() => setShowActions(!showActions)}
              variant="secondary"
              className="actions-toggle"
            >
              {showActions ? "▲" : "▼"} アクション
            </Button>

            {showActions && (
              <>
                <div className="dropdown-overlay" onClick={() => setShowActions(false)} />
                <div className="actions-dropdown">
                  <button onClick={onExportCSV} className="action-btn primary">
                    📊 CSV Export
                  </button>
                  {onCopyCSV && (
                    <button onClick={onCopyCSV} className="action-btn primary">
                      📋 クリップボードにコピー
                    </button>
                  )}
                  <button onClick={onClearAll} className="action-btn danger">
                    🗑️ Clear All
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
