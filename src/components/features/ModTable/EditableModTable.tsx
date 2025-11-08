import React, { useState, useCallback, useRef, useEffect } from "react";
import type { ModEntry } from "../../../domain/entities/ModEntry";
import { isValidModEntry } from "../../../domain/entities/ModEntry";
import { CsvExportDialog } from "../Export/CsvExportDialog";
import type { CsvExportOptions } from "../../../domain/entities/CsvExportOptions";

interface EditableModTableProps {
  modEntries: ModEntry[];
  onModEntriesChange: (modEntries: ModEntry[]) => void;
  onExportCSV: (options: CsvExportOptions) => void;
  onCopyCSV: (options: CsvExportOptions) => void;
  className?: string;
}

interface EditingCell {
  index: number;
  field: "mod" | "value";
}

export const EditableModTable: React.FC<EditableModTableProps> = ({
  modEntries,
  onModEntriesChange,
  onExportCSV,
  onCopyCSV,
  className = "",
}) => {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showCsvDialog, setShowCsvDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const startEdit = useCallback(
    (index: number, field: "mod" | "value") => {
      const currentValue = modEntries[index][field];
      setEditValue(currentValue);
      setEditingCell({ index, field });
    },
    [modEntries]
  );

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditValue("");
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingCell) return;

    const trimmedValue = editValue.trim();
    if (!trimmedValue) {
      cancelEdit();
      return;
    }

    const updatedEntries = [...modEntries];
    const updatedEntry = { ...updatedEntries[editingCell.index] };
    updatedEntry[editingCell.field] = trimmedValue;

    // バリデーション
    if (isValidModEntry(updatedEntry)) {
      updatedEntries[editingCell.index] = updatedEntry;
      onModEntriesChange(updatedEntries);
    }

    cancelEdit();
  }, [editingCell, editValue, modEntries, onModEntriesChange, cancelEdit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveEdit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEdit();
      }
    },
    [saveEdit, cancelEdit]
  );

  const deleteEntry = useCallback(
    (index: number) => {
      const updatedEntries = modEntries.filter((_, i) => i !== index);
      onModEntriesChange(updatedEntries);
    },
    [modEntries, onModEntriesChange]
  );

  const addNewEntry = useCallback(() => {
    const newEntry: ModEntry = { mod: "New Mod", value: "0" };
    const updatedEntries = [...modEntries, newEntry];
    onModEntriesChange(updatedEntries);
  }, [modEntries, onModEntriesChange]);

  const handleShowCsvDialog = useCallback(() => {
    setShowCsvDialog(true);
  }, []);

  const handleCloseCsvDialog = useCallback(() => {
    setShowCsvDialog(false);
  }, []);

  const handleExportCSV = useCallback(
    (options: CsvExportOptions) => {
      onExportCSV(options);
      setShowCsvDialog(false);
    },
    [onExportCSV]
  );

  const handleCopyCSV = useCallback(
    (options: CsvExportOptions) => {
      onCopyCSV(options);
      setShowCsvDialog(false);
    },
    [onCopyCSV]
  );

  if (modEntries.length === 0) {
    return (
      <div className={`mod-results ${className}`}>
        <h3>抽出されたMOD一覧:</h3>
        <p>MODが見つかりませんでした。</p>
        <button className="btn btn-primary" onClick={addNewEntry}>
          ➕ MODを追加
        </button>
      </div>
    );
  }

  return (
    <div className={`mod-results ${className}`}>
      <h3>抽出されたMOD一覧:</h3>
      <table className="mod-table">
        <thead>
          <tr>
            <th>MOD名</th>
            <th>値</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {modEntries.map((entry, index) => (
            <tr key={index}>
              <td
                onClick={() => startEdit(index, "mod")}
                className="editable-cell"
                title="クリックして編集"
              >
                {editingCell?.index === index && editingCell?.field === "mod" ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyDown}
                    className="edit-input"
                  />
                ) : (
                  entry.mod
                )}
              </td>
              <td
                onClick={() => startEdit(index, "value")}
                className="editable-cell"
                title="クリックして編集"
              >
                {editingCell?.index === index && editingCell?.field === "value" ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyDown}
                    className="edit-input"
                  />
                ) : (
                  entry.value
                )}
              </td>
              <td>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => deleteEntry(index)}
                  title="削除"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mod-table-actions">
        <button className="btn btn-primary" onClick={addNewEntry}>
          ➕ MODを追加
        </button>
        <button className="btn btn-secondary" onClick={handleShowCsvDialog}>
          📊 CSVエクスポート
        </button>
      </div>

      <CsvExportDialog
        isOpen={showCsvDialog}
        onClose={handleCloseCsvDialog}
        onExport={handleExportCSV}
        onCopy={handleCopyCSV}
        itemCount={1}
      />
    </div>
  );
};
