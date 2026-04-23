/** レビューの型(表示用) */
export type Review = {
  id: string;
  text: string;
  date: string;
};

/** レビューの型(データ用) */
export type ReviewData = {
  id: string;
  "text-jp": string;
  "text-en": string;
  date: string;
};

/** テキストノード内の UTF-16 オフセットと、その文の感情スコア（1〜5）。 */
export type SentenceSentiment = {
  start: number;
  end: number;
  score: number;
};

/** API が返す 1 レビュー分の分析結果（全体スコアと文単位レンジ）。 */
export type ReviewSentimentResult = {
  reviewId: string;
  overallScore: number;
  sentences: SentenceSentiment[];
};

/** `POST /review-sentiment` のレスポンスをフロントが受け取る形。 */
export type SentimentAnalysisResponse = {
  results: ReviewSentimentResult[];
};
