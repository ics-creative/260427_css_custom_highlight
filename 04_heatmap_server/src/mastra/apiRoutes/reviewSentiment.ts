import type { ContextWithMastra } from "@mastra/core/server";
import {
  agentSentimentResponseSchema,
  type SentenceSentiment,
  sentimentAnalysisResponseSchema,
  sentimentRequestSchema,
} from "../schemas/sentiment.ts";
import { locateSentences } from "../utils/locateSentences.ts";

/**
 * 文ごとのスコアからレビュー全体スコア（1〜5 の整数）を算出する。
 * 対象の文が無いときは中立として 3 を返す。
 *
 * @param sentences - locateSentences の結果など、文単位のスコア一覧
 * @returns 平均を四捨五入した整数スコア
 */
function averageScore(sentences: SentenceSentiment[]): number {
  if (sentences.length === 0) {
    return 3;
  }
  let total = 0;
  for (const sentence of sentences) {
    total += sentence.score;
  }
  return Math.round(total / sentences.length);
}

/**
 * `POST /review-sentiment` 用ハンドラ。リクエスト body を検証し、エージェントで
 * 文単位感情分析を実行してから原文上の開始・終了位置を付与し JSON を返す。
 *
 * @param c - Mastra が渡すコンテキスト（リクエストと `mastra` インスタンス取得用）
 * @returns 検証エラー時は 400、エージェント出力不正時は 502、成功時は分析結果の JSON
 */
export async function reviewSentimentHandler(
  c: ContextWithMastra,
): Promise<Response> {
  const rawBody: unknown = await c.req.json().catch(() => undefined);
  const parsedRequest = sentimentRequestSchema.safeParse(rawBody);
  if (!parsedRequest.success) {
    return c.json(
      { error: "invalid_request", issues: parsedRequest.error.issues },
      400,
    );
  }

  const mastra = c.get("mastra");
  const agent = mastra.getAgentById("reviewSentimentAgent");

  const prompt = `以下のレビュー群を判定対象とします。reviewId は必ず入力 id と一致させてください。\n\n${JSON.stringify(parsedRequest.data, null, 2)}`;

  const response = await agent.generate(prompt, {
    structuredOutput: {
      schema: agentSentimentResponseSchema,
      jsonPromptInjection: true,
    },
  });

  const parsedAgent = agentSentimentResponseSchema.safeParse(response.object);
  if (!parsedAgent.success) {
    return c.json(
      {
        error: "bad_agent_output",
        issues: parsedAgent.error.issues,
      },
      502,
    );
  }

  const reviewTextById = new Map<string, string>();
  for (const review of parsedRequest.data.reviews) {
    reviewTextById.set(review.id, review.text);
  }

  const results = parsedAgent.data.results.map((agentResult) => {
    const originalText = reviewTextById.get(agentResult.reviewId) ?? "";
    const sentences = locateSentences(originalText, agentResult.sentences);
    return {
      reviewId: agentResult.reviewId,
      overallScore: averageScore(sentences),
      sentences,
    };
  });

  const parsedResponse = sentimentAnalysisResponseSchema.safeParse({ results });
  if (!parsedResponse.success) {
    return c.json(
      {
        error: "bad_agent_output",
        issues: parsedResponse.error.issues,
      },
      502,
    );
  }
  return c.json(parsedResponse.data);
}
