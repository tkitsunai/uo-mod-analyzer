import { ConfigurableOcrAnalyzer } from "../services/ConfigurableOcrAnalyzer";
import {
  DEFAULT_UO_OCR_CONFIG,
  PERMISSIVE_OCR_CONFIG,
  type OcrAnalysisConfig,
} from "../entities/OcrAnalysisConfig";

/**
 * OCR解析ルールのテストとデバッグを支援するユーティリティ
 */
export class OcrAnalysisTestUtils {
  /**
   * 指定した設定でMOD抽出をテスト
   */
  static testModExtraction(text: string, config?: Partial<OcrAnalysisConfig>) {
    const analyzer = new ConfigurableOcrAnalyzer(
      config ? { ...DEFAULT_UO_OCR_CONFIG, ...config } : DEFAULT_UO_OCR_CONFIG
    );

    const result = analyzer.extractMods(text);

    return {
      inputText: text,
      config: analyzer.getConfig(),
      extractedMods: result,
      modCount: result.length,
    };
  }

  /**
   * アイテム名検証をテスト
   */
  static testItemNameValidation(itemName: string, config?: Partial<OcrAnalysisConfig>) {
    const analyzer = new ConfigurableOcrAnalyzer(
      config ? { ...DEFAULT_UO_OCR_CONFIG, ...config } : DEFAULT_UO_OCR_CONFIG
    );

    const isValid = analyzer.isValidItemName(itemName);
    const isModText = analyzer.isLikelyModText(itemName);

    return {
      inputName: itemName,
      isValid,
      isModText,
      config: analyzer.getConfig().itemNameValidation,
    };
  }

  /**
   * 異なる設定での結果を比較
   */
  static compareConfigurations(
    text: string,
    configs: { name: string; config: Partial<OcrAnalysisConfig> }[]
  ) {
    return configs.map(({ name, config }) => ({
      configName: name,
      result: this.testModExtraction(text, config),
    }));
  }

  /**
   * プリセット設定での比較テスト
   */
  static testPresetConfigurations(text: string) {
    return this.compareConfigurations(text, [
      { name: "Default UO", config: DEFAULT_UO_OCR_CONFIG },
      { name: "Permissive", config: PERMISSIVE_OCR_CONFIG },
      { name: "Debug Mode", config: { ...DEFAULT_UO_OCR_CONFIG, enableDebugLogging: true } },
      {
        name: "No UO Filter",
        config: { ...DEFAULT_UO_OCR_CONFIG, applyUltimaOnlineFiltering: false },
      },
    ]);
  }

  /**
   * 設定の妥当性をテスト
   */
  static validateConfiguration(config: Partial<OcrAnalysisConfig>) {
    const analyzer = new ConfigurableOcrAnalyzer({ ...DEFAULT_UO_OCR_CONFIG, ...config });
    return analyzer.validateConfig();
  }

  /**
   * OCRテキストサンプルを使った包括的テスト
   */
  static runComprehensiveTest() {
    const testCases = [
      // 典型的なUOアイテムツールチップ
      `Katana
Damage Increase 25%
Hit Chance Increase 15%
Swing Speed Increase 10%
Durability 255/255`,

      // MODが最初の行にあるケース
      `Damage Increase 25%
Exceptional Katana
Hit Chance Increase 15%
Swing Speed Increase 10%`,

      // 複雑なMOD値
      `War Axe of Power
Hit Point Increase 5
Hit Point Regeneration 2
Mana Increase 8
Stamina Increase 5`,

      // ノイズが多いOCRテキスト
      `War   Axe   
Damage   Increase   25%
  Hit Chance Increase   15%  
                  
Swing Speed Increase 10%`,
    ];

    return testCases.map((testCase, index) => ({
      testCaseIndex: index,
      testCase: testCase.replace(/\n/g, "\\n"),
      results: this.testPresetConfigurations(testCase),
    }));
  }
}
