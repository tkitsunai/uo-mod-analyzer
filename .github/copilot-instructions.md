# UO Mod Analyzer - AI Coding Instructions

## Architecture Overview

このプロジェクトは **Clean Architecture** パターンに基づく React + TypeScript アプリケーションです。OCR 技術でゲームアイテム画像から MOD 情報を抽出・分析します。

### レイヤー構造

- **Domain**: エンティティ (`AnalyzedItem`, `ModEntry`) とドメインサービス (`ItemNameEstimator`, `ModExtractor`)
- **Use Cases**: ビジネスロジック (`ImageProcessor`, `ItemHistoryUseCase`, `CsvExportUseCase`)
- **Infrastructure**: 外部サービス実装 (`TesseractOcrService`, `LocalStorageItemStorage`, `FileService`)
- **Presentation**: React フック (`useImageUpload`, `useOcrProcessing`) とコンポーネント

### 依存性注入パターン

インターフェースベースの依存性注入を使用:

```typescript
// Example: ImageProcessor constructor
constructor(ocrService: IOcrService) {
  this.ocrService = ocrService;
  this.fileHandler = new FileHandler(new FileService());
}
```

## 主要ドメインロジック

### アイテム名推定アルゴリズム

`ItemNameEstimator` は OCR テキストの最初の行がアイテム名という UO の法則に基づいて動作:

- MOD っぽいテキスト（`+5`, `10%` など）は除外
- 有効性判定でノイズを排除
- 信頼度スコア付きで推定結果を返す

### MOD 抽出パターン

`ModExtractor.MOD_REGEX = /([A-Za-z ]+)\s(\d+%?|\d+)/g` で MOD 名と値をペア抽出

## 開発ワークフロー

### 重要なコマンド

```bash
pnpm dev         # 開発サーバー起動 (localhost:5173)
pnpm build       # TypeScript コンパイル + Vite ビルド
pnpm deploy      # GitHub Pages デプロイ
```

### ビルド設定

- `base: "/uo-mod-analyzer/"` - GitHub Pages 用のパス設定
- TypeScript strict モード有効

## プロジェクト固有の慣習

### コメントルール

レイヤー別のコメント方針を採用:

#### Domain Layer

- ビジネスルールや複雑なアルゴリズムには詳細なコメント
- UO ゲーム固有の仕様説明は日本語で記述
- 正規表現や計算ロジックには実装意図を明記

```typescript
// UOでは最初の行がアイテム名という法則に基づく
const MOD_REGEX = /([A-Za-z ]+)\s(\d+%?|\d+)/g; // MOD名と数値をペア抽出
```

#### UseCase Layer

- 自己文書化コードを重視、最小限のコメントのみ
- メソッド名とパラメータで意図が明確な場合はコメント不要
- 複雑なビジネスフローのみ簡潔に説明

#### Infrastructure Layer

- 外部サービス連携部分には実装詳細をコメント
- エラーハンドリング戦略の説明
- 設定値やマジックナンバーの根拠を記述

#### Presentation Layer

- React コンポーネントの複雑な状態管理にコメント
- ユーザー操作フローの説明
- props の使用目的が不明確な場合のみ説明

### エラーハンドリング

日本語エラーメッセージを使用:

```typescript
catch (error) {
  console.error("アイテム履歴の読み込みに失敗しました:", error);
  return [];
}
```

### 状態管理

React フックで状態を集約、複雑なロジックは UseCase に委譲:

- `useItemHistory` → `ItemHistoryUseCase` → `ItemHistoryManager`
- localStorage 永続化は `LocalStorageItemStorage` で抽象化

### ファイル命名

- エンティティ: `AnalyzedItem.ts`, `ModEntry.ts`
- サービス: `ItemNameEstimator.ts`, `ModExtractor.ts`
- ユースケース: `ItemHistoryUseCase.ts`, `CsvExportUseCase.ts`
- フック: `useImageUpload.ts`, `useOcrProcessing.ts`

### コメント品質基準

#### 必須コメント

- 正規表現やアルゴリズムの実装意図
- UO ゲーム固有のビジネスルール
- 外部 API 連携の制約や仕様
- 複雑な状態変更ロジック

#### 禁止コメント

- メソッド名で理解できる単純な処理
- 自明な getter や setter の説明
- TypeScript の型で十分な情報
- 「〜を取得する」「〜を設定する」などの冗長な説明

#### 言語使い分け

- **日本語**: UO ゲーム仕様、ユーザー向けメッセージ、ビジネスドメイン
- **英語**: 技術的実装詳細、アルゴリズム、汎用的なプログラミング概念

## キー統合ポイント

### OCR 処理フロー

`ImageProcessor` → `TesseractOcrService` → `ModExtractor` → `ItemNameEstimator`

### データ永続化

`ItemHistoryManager` が `IItemStorage` インターフェースを通じて `LocalStorageItemStorage` を使用

### CSV エクスポート

`CsvExportUseCase` が `BrowserDownloadService` を使用してファイルダウンロードを実行

新機能追加時は Clean Architecture の境界を守り、日本語 UI と英語コードのバランスを保つことを重視してください。

## その他

- 日本語で回答してください
- コードの変更を行う前に、提案後、その計画に対する承認を得てください
