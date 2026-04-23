import type { SentimentAnalysisResponse } from "../types.ts";

const SERVER_URL: string = import.meta.env.VITE_MASTRA_SERVER_URL ?? "";
const SENTIMENT_PATH = "/review-sentiment";

/** `POST /review-sentiment` に送るレビュー1件（サーバーは受け取った `text` をそのまま扱う）。 */
export type ReviewSentimentRequestItem = {
  id: string;
  text: string;
};

/** 環境変数 `VITE_MASTRA_SERVER_URL` が設定されているか。 */
export function hasMastraServerUrl(): boolean {
  return SERVER_URL.length > 0;
}

/**
 * Mastra サーバーにレビュー一覧を送り、文単位感情分析結果を取得する。
 *
 * @param reviews - リクエスト body の `reviews` と同形（本文は呼び出し側が用意する）
 * @throws 非 OK の HTTP 応答のとき
 */
export async function analyzeReviews(
  reviews: readonly ReviewSentimentRequestItem[],
): Promise<SentimentAnalysisResponse> {
  const response = await fetch(`${SERVER_URL}${SENTIMENT_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviews }),
  });
  if (!response.ok) {
    throw new Error(`Mastra server error: HTTP ${String(response.status)}`);
  }
  return (await response.json()) as SentimentAnalysisResponse;
}
