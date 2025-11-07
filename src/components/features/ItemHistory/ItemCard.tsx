import React, { useState } from "react";
import type { AnalyzedItem } from "../../../domain/entities/AnalyzedItem";
import { formatItemName } from "../../../domain/entities/AnalyzedItem";
import { Button } from "../../common/Button";

interface ItemCardProps {
  item: AnalyzedItem;
  onDelete: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onPreview?: (item: AnalyzedItem) => void;
  className?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onDelete,
  onUpdateName,
  onPreview,
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [showDetails, setShowDetails] = useState(false);

  const handleSaveName = () => {
    if (editName.trim() !== item.name) {
      onUpdateName(item.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(item.name);
    setIsEditing(false);
  };

  const getModSummary = () => {
    return item.modEntries
      .slice(0, 3)
      .map((mod) => `${mod.mod}: ${mod.value}`)
      .join(", ");
  };

  return (
    <div className={`item-card ${showDetails ? "expanded" : ""} ${className}`}>
      <div className="item-header">
        {isEditing ? (
          <div className="item-name-edit">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") handleCancelEdit();
              }}
              className="item-name-input"
              autoFocus
            />
            <div className="edit-buttons">
              <Button onClick={handleSaveName} className="save-btn">
                💾
              </Button>
              <Button onClick={handleCancelEdit} variant="secondary" className="cancel-btn">
                ❌
              </Button>
            </div>
          </div>
        ) : (
          <div className="item-name-display">
            <h4 className="item-name">{formatItemName(item)}</h4>
            <div className="header-actions">
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="secondary"
                className="toggle-details-btn"
              >
                {showDetails ? "🔼" : "🔽"}
              </Button>
              <Button onClick={() => setIsEditing(true)} variant="secondary" className="edit-btn">
                ✏️
              </Button>
            </div>
          </div>
        )}
      </div>

      {item.modEntries.length > 0 && (
        <div className="item-mods-summary">
          <span className="mods-summary">{getModSummary()}</span>
          {item.modEntries.length > 3 && (
            <span className="more-mods">...他{item.modEntries.length - 3}件</span>
          )}
        </div>
      )}

      {showDetails && (
        <div className="item-details">
          <div className="details-section">
            <h5>🎯 全MOD情報</h5>
            <div className="mods-list">
              {item.modEntries.map((mod, index) => (
                <div key={index} className="mod-entry">
                  <span className="mod-name">{mod.mod}:</span>
                  <span className="mod-value">{mod.value}</span>
                </div>
              ))}
            </div>
          </div>

          {item.imageUrl && (
            <div className="details-section">
              <h5>🖼️ 画像プレビュー</h5>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="item-image-preview"
                onClick={() => onPreview?.(item)}
              />
            </div>
          )}
        </div>
      )}

      <div className="item-actions">
        <div className="action-buttons">
          {onPreview && item.imageUrl && (
            <Button onClick={() => onPreview(item)} variant="secondary" className="preview-btn">
              👁️
            </Button>
          )}
          <Button onClick={() => onDelete(item.id)} variant="secondary" className="delete-btn">
            🗑️
          </Button>
        </div>
      </div>
    </div>
  );
};
