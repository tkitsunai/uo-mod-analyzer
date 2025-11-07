/**
 * OCRテキスト解析の設定インターフェース
 * パターンマッチングルールやフィルタリング条件を設定可能にする
 */
export interface OcrAnalysisConfig {
  /**
   * MOD抽出の正規表現パターン
   */
  modExtractionPattern: RegExp;

  /**
   * UO固有フィルタを適用するか
   */
  applyUltimaOnlineFiltering: boolean;

  /**
   * デバッグログを出力するか
   */
  enableDebugLogging: boolean;

  /**
   * アイテム名の検証ルール
   */
  itemNameValidation: {
    minLength: number;
    maxLength: number;
    allowedCharacterPattern: RegExp;
    excludedPatterns: RegExp[];
  };

  /**
   * MODテキスト判定パターン
   */
  modTextPatterns: RegExp[];

  /**
   * OCRテキスト前処理設定
   */
  textPreprocessing: {
    normalizeWhitespace: boolean;
    removeEmptyLines: boolean;
    trimLines: boolean;
  };
}

/**
 * UltimaOnline向けのデフォルト設定
 */
export const DEFAULT_UO_OCR_CONFIG: OcrAnalysisConfig = {
  modExtractionPattern: /([A-Za-z ]+)\s(\d+%?|\d+)/g,
  applyUltimaOnlineFiltering: true,
  enableDebugLogging: true,

  itemNameValidation: {
    minLength: 2,
    maxLength: 60,
    allowedCharacterPattern: /^[\w\s\-\+\(\)]+$/,
    excludedPatterns: [
      /^[\d\s\+\-\%\(\)]+$/, // 数字と記号のみ
      /^\d+\s*%?\s*$/, // 数値のみ
      /^[\+\-]\d+/, // プラスマイナス数値
    ],
  },

  modTextPatterns: [
    /\d+%/, // パーセンテージ
    /\+\d+/, // プラス値
    /resist/i, // resist系
    /increase/i, // increase系
    /regeneration/i, // regeneration系
    /damage/i, // damage系
    /hit\s+chance/i, // hit chance系
    /defense\s+chance/i, // defense chance系
  ],

  textPreprocessing: {
    normalizeWhitespace: true,
    removeEmptyLines: true,
    trimLines: true,
  },
};

/**
 * テスト用の緩い設定
 */
export const PERMISSIVE_OCR_CONFIG: OcrAnalysisConfig = {
  ...DEFAULT_UO_OCR_CONFIG,
  applyUltimaOnlineFiltering: false,
  enableDebugLogging: true,
  itemNameValidation: {
    ...DEFAULT_UO_OCR_CONFIG.itemNameValidation,
    minLength: 1,
    maxLength: 100,
    excludedPatterns: [], // 除外パターンなし
  },
};
