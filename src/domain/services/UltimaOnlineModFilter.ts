import type { ModEntry } from "../entities/ModEntry";

/**
 * UltimaOnline固有のMOD除外ルールを適用するサービス
 */
export class UltimaOnlineModFilter {
  // UOで実際には存在しないMOD名（OCR誤認識によるもの）
  private static readonly INVALID_MOD_NAMES = new Set([
    "I",
    "II",
    "III",
    "IV",
    "V", // ローマ数字（誤認識）
    "O",
    "0",
    "l",
    "1", // 単一文字（誤認識）
    "the",
    "of",
    "and",
    "to",
    "in", // 英語の前置詞（誤認識）
    "ltem",
    "ltems",
    "Equipment", // アイテム説明テキスト
    "Durability",
    "Uses",
    "Range", // 装備情報（MODではない）
    "Hue",
    "Priority", // アイテム属性情報（MODではない）
    "Weight",
    "Amount",
    "Quantity",
    "Count", // 重量・数量情報（MODではない）
    "Layer",
    "Type",
    "Material", // アイテム種別情報（MODではない）
    "Strength Requirement",
    "Requirement", // 装備要求情報（MODではない）
  ]);

  // UOで実際には存在しない値パターン
  private static readonly INVALID_VALUE_PATTERNS = [
    /^0+$/, // すべて0の値
    /^\d{4,}$/, // 4桁以上の大きすぎる数値
    /^[+\-]?\d*\./, // 小数点を含む値
  ];

  // UOでMODとして認識されるべき最小値
  private static readonly MIN_MEANINGFUL_VALUES = new Map([
    ["damage increase", 1],
    ["hit chance increase", 1],
    ["swing speed increase", 5],
    ["luck", 1],
    ["lower reagent cost", 1],
    ["lower mana cost", 1],
    ["mana increase", 1],
    ["stamina increase", 1],
    ["hit point increase", 1],
  ]);

  /**
   * UO固有のルールに基づいてMODエントリをフィルタリング
   */
  static filterValidMods(modEntries: ModEntry[]): ModEntry[] {
    return modEntries.filter((entry) => this.isValidUOMod(entry));
  }

  /**
   * UOの文脈で有効なMODかどうかを判定
   */
  static isValidUOMod(entry: ModEntry): boolean {
    const modName = entry.mod.toLowerCase().trim();
    const value = entry.value.trim();

    // 完全一致での無効なMOD名をチェック
    if (this.INVALID_MOD_NAMES.has(modName)) {
      console.log(`🚫 UO MOD Filter: Invalid mod name "${entry.mod}"`);
      return false;
    }

    // 部分一致での無効なMOD名をチェック（より柔軟な除外）
    const invalidPatterns = [
      "durability",
      "durabitity",
      "durabiiity",
      "hue",
      "priority",
      "weight",
      "uses",
      "strength requirement",
      "requirement",
    ];
    for (const pattern of invalidPatterns) {
      if (modName.includes(pattern)) {
        console.log(`🚫 UO MOD Filter: Contains invalid pattern "${pattern}" in "${entry.mod}"`);
        return false;
      }
    }

    // OCR誤認識に対応した正規表現パターンチェック
    const ocrErrorPatterns = [
      /durab[il]+[it]+y/i, // durability の b/l, i/l 誤認識
      /priorit[iy]/i, // priority の y/i 誤認識
      /we[il]ght/i, // weight の i/l 誤認識
      /strength\s+requ[il]rement/i, // strength requirement の i/l 誤認識
      /requ[il]rement/i, // requirement の i/l 誤認識
    ];
    for (const pattern of ocrErrorPatterns) {
      if (pattern.test(modName)) {
        console.log(`🚫 UO MOD Filter: OCR error pattern matched "${pattern}" in "${entry.mod}"`);
        return false;
      }
    }

    // 無効な値パターンをチェック
    for (const pattern of this.INVALID_VALUE_PATTERNS) {
      if (pattern.test(value)) {
        console.log(`🚫 UO MOD Filter: Invalid value pattern "${entry.value}" for "${entry.mod}"`);
        return false;
      }
    }

    // 最小有意値をチェック
    const numericValue = parseInt(value.replace(/[^\d]/g, ""), 10);
    if (!isNaN(numericValue)) {
      const minValue = this.MIN_MEANINGFUL_VALUES.get(modName);
      if (minValue !== undefined && numericValue < minValue) {
        console.log(
          `🚫 UO MOD Filter: Value too low "${entry.value}" for "${entry.mod}" (min: ${minValue})`
        );
        return false;
      }
    }

    return true;
  }

  /**
   * フィルタールールの統計情報を取得（デバッグ用）
   */
  static getFilterStats(originalEntries: ModEntry[], filteredEntries: ModEntry[]): FilterStats {
    return {
      originalCount: originalEntries.length,
      filteredCount: filteredEntries.length,
      removedCount: originalEntries.length - filteredEntries.length,
      removalRate:
        originalEntries.length > 0
          ? (
              ((originalEntries.length - filteredEntries.length) / originalEntries.length) *
              100
            ).toFixed(1) + "%"
          : "0%",
    };
  }
}

export interface FilterStats {
  originalCount: number;
  filteredCount: number;
  removedCount: number;
  removalRate: string;
}
