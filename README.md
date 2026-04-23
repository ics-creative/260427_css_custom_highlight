# 260427_css_custom_highlight

CSS Custom Highlight API のデモ集。

## デモ一覧

すべて `docs/` 配下にあり、GitHub Pages から配信されます。

- `docs/01_basic/` - 最小サンプル
- `docs/02_search/` - 検索ハイライト
- `docs/03_correction/` - 校正ハイライト
- `docs/04_heatmap/` - 映画レビュー風 UI。**Mastra Agent（Google Gemini）** で感情スコアを付け、文単位でピンク〜ブルーのハイライトを付与（Vite ビルド出力）
- `docs/05_list/` - リスト内ハイライト

## ディレクトリ構成

```
.
├── docs/                  # GitHub Pages 公開ルート（git 管理）
│   ├── index.html
│   ├── 01_basic/
│   ├── 02_search/
│   ├── 03_correction/
│   ├── 04_heatmap/        # 04_heatmap の Vite ビルド出力（コミット対象）
│   └── 05_list/
├── 04_heatmap/            # フロントエンド（Vite）
└── 04_heatmap_server/     # Mastra Agent サーバー（Hono + Google Gemini）
```

## 開発

### 静的デモ（01/02/03/05）

ビルド不要。`docs/` 配下の HTML を直接編集。

### 04_heatmap（Sentiment heatmap）

このデモはフロント（`04_heatmap/`）と Mastra サーバー（`04_heatmap_server/`）の 2 ワークスペース構成です。ローカル開発では両方を起動します。

#### 初期セットアップ

ルートで一度だけ：

```sh
npm install
```

Mastra 側の API キーを用意:

```sh
cp 04_heatmap_server/.env.example 04_heatmap_server/.env
# 04_heatmap_server/.env に GOOGLE_GENERATIVE_AI_API_KEY を記入
# https://aistudio.google.com/apikey で無料枠の API キーを発行可能
```

フロント側の接続先を指定:

```sh
cp 04_heatmap/.env.example 04_heatmap/.env.local
# 04_heatmap/.env.local の VITE_MASTRA_SERVER_URL にローカルの Mastra URL を記入
# 例: VITE_MASTRA_SERVER_URL=http://127.0.0.1:4111
```

#### ローカル起動

ターミナル 1 で Mastra サーバー（`:4111`）:

```sh
npm run dev:server
```

ターミナル 2 で Vite 開発サーバー（`:5173`）:

```sh
npm run dev
```

ブラウザで `http://localhost:5173/` を開き、「AI 判定」ボタンでレビューを分析。

#### 本番ビルド

```sh
npm run build          # docs/04_heatmap/ へ出力（GH Pages 用）
npm run build:server   # 04_heatmap_server/.mastra/output/ へバンドル
```

#### HTTP 契約

フロントはこのエンドポイントへ POST します（`VITE_MASTRA_SERVER_URL` + `/review-sentiment`。`/api` は Mastra の内部ルート予約領域のため使わない）。

**リクエスト:**

```json
{
  "reviews": [{ "id": "seed-1", "text": "良かった。上映時間は 2 時間。感動した。" }]
}
```

**レスポンス（感情のある文のみ）:**

`start` / `end` は原文 `text` 内の UTF-16 オフセット。`text.slice(start, end)` が該当文の原文になります。

```json
{
  "results": [
    {
      "reviewId": "seed-1",
      "overallScore": 8,
      "sentences": [
        { "start": 0, "end": 5, "score": 7 },
        { "start": 18, "end": 23, "score": 9 }
      ]
    }
  ]
}
```

### Mastra サーバーのデプロイ

#### Mastra Cloud（推奨）

1. [Mastra Cloud](https://mastra.ai/) でプロジェクトを作成し、このリポジトリを接続
2. Root directory を `04_heatmap_server` に指定
3. 環境変数に `GOOGLE_GENERATIVE_AI_API_KEY` を設定
4. 払い出された公開 URL を、本番フロントビルド時の `VITE_MASTRA_SERVER_URL` として設定

#### Vercel（代替）

`04_heatmap_server/` に `@mastra/deployer-vercel` を追加し、`Mastra` コンストラクタの `deployer` に渡します。詳細は [Mastra 公式のデプロイガイド](https://mastra.ai/docs/deployment/overview) を参照。

### CORS

Mastra サーバー側で以下のオリジンを許可しています（[04_heatmap_server/src/mastra/index.ts](./04_heatmap_server/src/mastra/index.ts)）：

- `http://localhost:5173` / `http://127.0.0.1:5173`（ローカル Vite）
- `https://ics-creative.github.io`（本番 GH Pages）

他のオリジンから叩きたい場合はここを追記してください。

## GitHub Pages 設定

リポジトリの Settings → Pages で以下を設定（初回のみ）：

- Source: **Deploy from a branch**
- Branch: `main` / Folder: `/docs`

公開URL例: `https://ics-creative.github.io/260427_css_custom_highlight/`

04_heatmap のビルド出力 `docs/04_heatmap/` は git にコミットします。ローカルで `npm run build` した後、`docs/04_heatmap/` の差分を含めてコミット・プッシュしてください。
