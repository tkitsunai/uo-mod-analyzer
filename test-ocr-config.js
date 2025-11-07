import { OcrAnalysisTestUtils } from "./src/domain/utils/OcrAnalysisTestUtils";

/**
 * OCR解析ルールの設定システムをテストするスクリプト
 */
console.log("🧪 OCR Analysis Configuration System Test");
console.log("=".repeat(50));

// 1. 基本的なMOD抽出テスト
const testText = `Katana
Damage Increase 25%
Hit Chance Increase 15%
Swing Speed Increase 10%
Durability 255/255`;

console.log("\n📝 Test Text:");
console.log(testText.replace(/\n/g, " | "));

// 2. プリセット設定での比較テスト
console.log("\n🔬 Preset Configuration Comparison:");
const presetResults = OcrAnalysisTestUtils.testPresetConfigurations(testText);

presetResults.forEach(({ configName, result }) => {
  console.log(`\n${configName}:`);
  console.log(`  MODs found: ${result.modCount}`);
  console.log(`  UO Filter: ${result.config.applyUltimaOnlineFiltering}`);
  console.log(`  Debug: ${result.config.enableDebugLogging}`);
  result.extractedMods.forEach((mod) => {
    console.log(`    - ${mod.mod}: ${mod.value}`);
  });
});

// 3. アイテム名検証テスト
console.log("\n🏷️  Item Name Validation Test:");
const testNames = [
  "Katana",
  "Damage Increase 25%",
  "War Axe of Power",
  "123",
  "+15",
  "A",
  "Very Long Item Name That Exceeds Normal Limits",
];

testNames.forEach((name) => {
  const validation = OcrAnalysisTestUtils.testItemNameValidation(name);
  console.log(`  "${name}": Valid=${validation.isValid}, ModText=${validation.isModText}`);
});

// 4. 設定妥当性テスト
console.log("\n⚙️  Configuration Validation Test:");
const validConfig = {
  enableDebugLogging: true,
  modExtractionPattern: /([A-Za-z ]+)\s(\d+%?|\d+)/g,
};

const validation = OcrAnalysisTestUtils.validateConfiguration(validConfig);
console.log(`  Valid: ${validation.isValid}`);
if (!validation.isValid) {
  validation.errors.forEach((error) => console.log(`    Error: ${error}`));
}

console.log("\n✅ Test completed!");
