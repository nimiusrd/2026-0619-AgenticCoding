# React + Vite + TypeScript Bootstrap

このプロジェクトは、React 19、Vite 6、TypeScript を使用した最新のボイラープレートテンプレートです。

## 要件

- Node.js v24（`.nvmrc`に指定）
- npm 10 以上

## 開発環境構築

```bash
# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run typecheck

# リント
npm run lint

# リント修正
npm run lint:fix

# テスト実行
npm run test

# テストカバレッジ
npm run test:coverage
```

## プロジェクト構成

```
.
├── .github/workflows/    # GitHub Actions CI/CD設定
├── src/
│   ├── main.tsx       # アプリケーションエントリーポイント
│   ├── App.tsx        # ルートコンポーネント
│   ├── App.css        # アプリケーションスタイル
│   └── index.css      # グローバルスタイル
├── public/
│   └── index.html     # HTMLテンプレート
├── package.json       # プロジェクト設定と依存関係
├── tsconfig.json      # TypeScript設定（厳密モード）
├── vite.config.ts     # Vite設定
├── vitest.config.ts   # Vitest設定
├── biome.json         # Biome設定（linter/formatter）
├── .nvmrc             # Node.jsバージョン指定
└── README.md          # このファイル
```

## 主な特徴

- **React 19**: 最新のReactバージョン
- **Vite 6**: 高速なビルドツール
- **TypeScript 厳密モード**: 型安全性を最大化
- **Biome**: 高速なリントとフォーマッター
- **Vitest**: Vitestベースのテストフレームワーク
- **GitHub Actions**: CI/CD自動化

## スクリプト

- `npm run dev` - 開発サーバーを起動（ホットリロード対応）
- `npm run build` - 本番用にビルド
- `npm run typecheck` - TypeScript型チェック
- `npm run lint` - コードをリント
- `npm run lint:fix` - コードを自動修正
- `npm run test` - テストを実行
- `npm run test:coverage` - テストカバレッジを生成

## CI/CD

このプロジェクトはGitHub Actionsで自動検証を実行します。

**トリガー:**
- `main` / `002` ブランチへの push
- これらのブランチへの pull request

**実行内容:**
- TypeScript型チェック
- Biomeリント
- Vitestでテスト実行
- 本番ビルド
- カバレッジレポートのアップロード

## ライセンス

MIT