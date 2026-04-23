/// <reference types="vite/client" />

/** Vite が `import.meta.env` に注入する環境変数（`VITE_` プレフィックス）。 */
interface ImportMetaEnv {
  /** Mastra サーバーのベース URL（末尾スラッシュなし想定）。 */
  readonly VITE_MASTRA_SERVER_URL?: string;
  /** 感情分析 API のパス（未使用の場合あり）。 */
  readonly VITE_MASTRA_SENTIMENT_PATH?: string;
}

/** Vite が提供する `import.meta` の型（環境変数参照用）。 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
