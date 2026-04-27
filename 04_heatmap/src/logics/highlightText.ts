import type {
  ReviewSentimentResult,
  SentenceSentiment,
  SentimentAnalysisResponse,
} from "../types.ts";

// 感情スコアごとの範囲マップ
const rangeMap = new Map<number, Range[]>();

/**
 * ハイライトをクリアする
 */
export const clearHighlight = () => {
  for (let level = 1; level <= 5; level += 1) {
    CSS.highlights.delete(`sentiment-${String(level)}`);
  }
  rangeMap.clear();
};

/**
 * ノードがテキストノードかどうかを判定する型ガード
 */
const isTextNode = (node: Node | null): node is Text =>
  node !== null && node.nodeType === Node.TEXT_NODE;

/**
 * レビュー本文のテキストノードを返す
 */
const getTextNodeForReviewBody = (
  result: ReviewSentimentResult,
  nodes: NodeListOf<HTMLElement>,
): Text | undefined => {
  const elm = Array.from(nodes).find(
    (node) => node.dataset.reviewId === result.reviewId,
  );
  if (!elm) {
    return undefined;
  }
  const first = elm.firstChild;
  if (!isTextNode(first)) {
    return undefined;
  }
  return first;
};

/**
 * 範囲を感情スコアごとにmapに追加
 */
const applyRange = (sentence: SentenceSentiment, range: Range) => {
  const bucket = rangeMap.get(sentence.score);
  if (bucket === undefined) {
    rangeMap.set(sentence.score, [range]);
  } else {
    bucket.push(range);
  }
};

/**
 * 分析結果に基づき、各レビュー本文に Custom Highlight API で文単位の色分けを適用する。
 * @param response サーバーからの分析結果
 */
export function applySentimentHighlights(response: SentimentAnalysisResponse) {
  clearHighlight();
  // レビューのDOM要素を取得
  const reviews = document.querySelectorAll<HTMLElement>("[data-review-id]");

  for (const result of response.results) {
    // テキストノードを取得
    const textNode = getTextNodeForReviewBody(result, reviews);
    if (textNode === undefined) {
      continue;
    }
    // APIの結果から範囲を作成して適用
    for (const sentence of result.sentences) {
      const range = new Range();
      range.setStart(textNode, sentence.start);
      range.setEnd(textNode, sentence.end);
      applyRange(sentence, range);
    }
  }

  // 感情スコアごとの範囲をハイライト
  for (const [level, ranges] of rangeMap) {
    CSS.highlights.set(`sentiment-${String(level)}`, new Highlight(...ranges));
  }
}
