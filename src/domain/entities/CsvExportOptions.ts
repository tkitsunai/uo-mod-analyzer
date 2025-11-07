export interface CsvExportOptions {
  // ヘッダー設定
  includeHeaders: boolean;
}

export const defaultCsvExportOptions: CsvExportOptions = {
  includeHeaders: true,
};
