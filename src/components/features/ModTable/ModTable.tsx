import React from "react";
import type { ModEntry } from "../../../domain/entities/ModEntry";
import { Button } from "../../common/Button";

interface ModTableProps {
  modEntries: ModEntry[];
  onExportCSV: () => void;
  className?: string;
}

export const ModTable: React.FC<ModTableProps> = ({ modEntries, onExportCSV, className = "" }) => {
  if (modEntries.length === 0) {
    return null;
  }

  return (
    <div className={`mod-results ${className}`}>
      <h3>抽出されたMOD一覧:</h3>
      <table className="mod-table">
        <thead>
          <tr>
            <th>MOD名</th>
            <th>値</th>
          </tr>
        </thead>
        <tbody>
          {modEntries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.mod}</td>
              <td>{entry.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button onClick={onExportCSV} variant="secondary">
        CSVをダウンロード
      </Button>
    </div>
  );
};
