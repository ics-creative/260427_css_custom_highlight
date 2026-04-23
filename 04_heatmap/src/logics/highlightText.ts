import type { SentimentAnalysisResponse } from "../types.ts";

/**
 * ハイライトをクリアする
 */
export function clearHighlight() {
  for (let level = 1; level <= 5; level += 1) {
    CSS.highlights.delete(`sentiment-${String(level)}`);
  }
}

/**
 * ノードがテキストノードかどうかを判定する型ガード
 */
function isTextNode(node: Node | null): node is Text {
  return node !== null && node.nodeType === Node.TEXT_NODE;
}

/**
 * レビュー本文のテキストノードを返す
 */
function getTextNodeForReviewBody(
  elm: HTMLElement | undefined,
): Text | undefined {
  if (!elm) {
    return undefined;
  }
  const first = elm.firstChild;
  if (!isTextNode(first)) {
    return undefined;
  }
  return first;
}

/**
 * 分析結果に基づき、各レビュー本文に Custom Highlight API で文単位の色分けを適用する。
 * @param response サーバーからの分析結果
 */
export function applySentimentHighlights(response: SentimentAnalysisResponse) {
  clearHighlight();
  const rangesByLevel = new Map<number, Range[]>();
  const reviews = document.querySelectorAll<HTMLElement>("[data-review-id]");

  for (const result of response.results) {
    const elm = Array.from(reviews).find(
      (review) => review.dataset.reviewId === result.reviewId,
    );
    const textNode = getTextNodeForReviewBody(elm);
    if (textNode === undefined) {
      continue;
    }
    const textLength = textNode.data.length;
    for (const sentence of result.sentences) {
      if (sentence.start < 0 || sentence.end > textLength) {
        continue;
      }
      if (sentence.start >= sentence.end) {
        continue;
      }
      const range = new Range();
      range.setStart(textNode, sentence.start);
      range.setEnd(textNode, sentence.end);
      const bucket = rangesByLevel.get(sentence.score);
      if (bucket === undefined) {
        rangesByLevel.set(sentence.score, [range]);
      } else {
        bucket.push(range);
      }
    }
  }

  for (const [level, ranges] of rangesByLevel) {
    CSS.highlights.set(`sentiment-${String(level)}`, new Highlight(...ranges));
  }
}
