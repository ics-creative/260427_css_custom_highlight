import { z } from "zod";

/** 原文 UTF-16 コードユニット単位の半開区間 [start, end) と、その文の感情スコア。 */
export const sentenceSentimentSchema = z.object({
  start: z.number().int().min(0),
  end: z.number().int().min(0),
  score: z.number().int().min(1).max(5),
});

/** 1 件のレビューに対する API 応答（全体スコアと文ごとの位置付きスコア）。 */
export const reviewSentimentResultSchema = z.object({
  reviewId: z.string(),
  overallScore: z.number().int().min(1).max(5),
  sentences: z.array(sentenceSentimentSchema),
});

/** `POST /review-sentiment` 成功時のレスポンス body。 */
export const sentimentAnalysisResponseSchema = z.object({
  results: z.array(reviewSentimentResultSchema),
});

/** クライアントから送るレビュー一覧のリクエスト body。 */
export const sentimentRequestSchema = z.object({
  reviews: z.array(
    z.object({
      id: z.string().min(1),
      text: z.string().min(1),
    }),
  ),
});

/** エージェントが返す「感情を含む文」のテキストとスコア（原文オフセットは含まない）。 */
export const agentSentenceSchema = z.object({
  text: z.string().min(1),
  score: z.number().int().min(1).max(5),
});

/** エージェント出力における 1 レビュー分（reviewId と抽出した文の列）。 */
export const agentReviewResultSchema = z.object({
  reviewId: z.string(),
  sentences: z.array(agentSentenceSchema),
});

/** 構造化出力としてエージェントから受け取る感情分析結果全体。 */
export const agentSentimentResponseSchema = z.object({
  results: z.array(agentReviewResultSchema),
});

/** {@link sentimentAnalysisResponseSchema} から推論した型。 */
export type SentimentAnalysisResponse = z.infer<
  typeof sentimentAnalysisResponseSchema
>;

/** {@link sentimentRequestSchema} から推論した型。 */
export type SentimentRequest = z.infer<typeof sentimentRequestSchema>;

/** {@link sentenceSentimentSchema} から推論した型。 */
export type SentenceSentiment = z.infer<typeof sentenceSentimentSchema>;

/** {@link agentSentenceSchema} から推論した型。 */
export type AgentSentence = z.infer<typeof agentSentenceSchema>;
