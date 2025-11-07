export interface ModEntry {
  mod: string;
  value: string;
}

export const isValidModEntry = (entry: ModEntry): boolean => {
  const mod = entry.mod.trim();
  const value = entry.value.trim();

  // 基本的な形式チェック
  if (mod.length <= 1 || value.length === 0) {
    return false;
  }

  // 明らかに無効なパターンを除外
  if (mod === "undefined" || mod === "null" || mod === "NaN") {
    return false;
  }

  // 値が数値として解釈できない場合は除外
  if (!/^\d+%?$/.test(value) && !/^[+\-]?\d+$/.test(value)) {
    return false;
  }

  return true;
};

export const formatModEntry = (entry: ModEntry): string => {
  return `${entry.mod}: ${entry.value}`;
};
