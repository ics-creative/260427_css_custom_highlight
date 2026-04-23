import { Agent } from "@mastra/core/agent";

export const reviewSentimentAgent = new Agent({
  id: "reviewSentimentAgent",
  name: "Review Sentiment Agent",
  instructions: `あなたは映画レビューを文単位で感情判定するエージェントです。
各レビューについて原文を文に分割し、感情を含む文のみを抽出してください。

- 感情を含まない事実記述（俳優名・上映時間などの説明）は対象外とします。
- text は原文中に現れる文の表記をそのまま返してください（原文の一部と一致するよう、語句や句読点を改変しないこと）。
- score は 1（強ネガティブ）〜 5（強ポジティブ）の整数。中立に近い場合は 2〜4 の範囲。
- reviewId は入力の id と必ず一致させてください。
- 感情を含む文が無いレビューは sentences を空配列にしてください。`,
  model: "google/gemini-2.5-flash",
});
