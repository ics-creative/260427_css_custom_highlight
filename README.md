# 260427_css_custom_highlight

CSS Custom Highlight API のデモ集。

## デモ一覧

すべて `docs/` 配下にあり、GitHub Pages から配信されます。

- `docs/01_basic/` - 最小サンプル
- `docs/02_search/` - 検索ハイライト
- `docs/03_correction/` - 校正ハイライト
- `docs/04_mastra/` - Mastra による感情ヒートマップ（実装予定）
- `docs/05_list/` - リスト内ハイライト

## ディレクトリ構成

```
.
├── docs/           # GitHub Pages 公開ルート（git 管理）
│   ├── index.html  # デモ一覧
│   ├── 01_basic/
│   ├── 02_search/
│   ├── 03_correction/
│   ├── 04_mastra/  # 04_mastra の Vite ビルド出力（コミット対象）
│   └── 05_list/
└── 04_mastra/      # Mastra デモのソース（npm workspace）
```

## 開発

### 静的デモ（01/02/03/05）

ビルド不要。`docs/` 配下の HTML を直接編集してください。

### Mastra デモ（04_mastra）

ルートで一度 `npm install` を実行してください。

```sh
npm install
```

開発サーバー起動：

```sh
npm run dev
```

ビルド（`docs/04_mastra/` に出力）：

```sh
npm run build
```

Mastra サーバーの接続先は [04_mastra/.env.example](./04_mastra/.env.example) を参考に `.env.local` で設定します。Mastra サーバー本体は別リポジトリ / 別サービス（Mastra Cloud / Vercel など）にデプロイする想定で、本リポジトリには含みません。

## GitHub Pages 設定

リポジトリの Settings → Pages で以下を設定（初回のみ）：

- Source: **Deploy from a branch**
- Branch: `main` / Folder: `/docs`

公開URL例: `https://ics-creative.github.io/260427_css_custom_highlight/`

04_mastra のビルド出力 `docs/04_mastra/` は git にコミットします。ローカルで `npm run build` した後、`docs/04_mastra/` の差分を含めてコミット・プッシュしてください。
