# UO Mod Analyzer

UO Mod Analyzer は、画像からテキストを抽出して MOD の情報を解析する Web アプリケーションです。OCR（光学文字認識）技術を使用して、ゲーム内のアイテムや MOD の詳細を読み取り、分析します。

## 🌐 Live Demo

[**UO Mod Analyzer**](https://tkitsunai.github.io/uo-mod-analyzer/) - GitHub Pages で公開中

## ✨ 特徴

- 📸 **画像アップロード**: ゲーム内のスクリーンショットをアップロード
- 🔍 **OCR 解析**: Tesseract.js を使用した高精度なテキスト認識
- 📊 **MOD 情報抽出**: アイテムの詳細や MOD 情報を自動解析
- 🎨 **レスポンシブデザイン**: モバイルとデスクトップの両方に対応
- ⚡ **高速処理**: React による効率的な UI 更新

## 🛠️ 技術スタック

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **OCR Engine**: Tesseract.js
- **Styling**: CSS3
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🚀 開発環境のセットアップ

### 前提条件

- Node.js (v18 以上)
- pnpm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/tkitsunai/uo-mod-analyzer.git
cd uo-mod-analyzer

# 依存関係をインストール
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

開発サーバーが `http://localhost:5173` で起動します。

### ビルド

```bash
pnpm build
```

### プレビュー

```bash
pnpm preview
```

## 📁 プロジェクト構造

```
uo-mod-analyzer/
├── public/           # 静的ファイル
├── src/              # ソースコード
│   ├── App.tsx       # メインアプリケーション
│   ├── main.tsx      # エントリーポイント
│   └── assets/       # 画像・アイコン等
├── .github/          # GitHub Actions ワークフロー
└── dist/             # ビルド出力（自動生成）
```

## 🔧 使用方法

1. アプリケーションにアクセス
2. 「画像を選択」ボタンをクリックして、MOD 情報が表示された画像をアップロード
3. OCR 処理が自動的に実行され、テキストが抽出されます
4. 抽出されたテキストから MOD 情報を確認

## 🤝 コントリビューション

プルリクエストや Issue の投稿を歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🔗 関連リンク

- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR ライブラリ
- [React](https://react.dev/) - UI ライブラリ
- [Vite](https://vite.dev/) - ビルドツール
