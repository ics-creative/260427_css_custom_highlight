import type { AgentSentence, SentenceSentiment } from "../schemas/sentiment.ts";

type StrippedText = {
  stripped: string;
  indexMap: number[];
};

/**
 * 各文字が元テキストのどのコードユニット位置かを示すインデックス配列を返す。
 * @param text - 原文
 */
function stripWhitespace(text: string): StrippedText {
  const chars: string[] = [];
  const indexMap: number[] = [];
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (!/\s/.test(char)) {
      chars.push(char);
      indexMap.push(index);
    }
  }
  return { stripped: chars.join(""), indexMap };
}

/**
 * エージェントが返した sentence.text を原文中から検索し、UTF-16 コードユニット単位のstart / endを算出する。
 *
 * - 空白差異を吸収するため空白を除去してから処理します
 * - 得られたインデックスを原文インデックスへ変換します
 * - 見つからなかった文は結果から除外する。
 *
 * @param originalText - ユーザーが投稿したレビュー本文
 * @param agentSentences - エージェントが返した文テキストとスコアの列（原文順を想定）
 */
export function locateSentences(
  originalText: string,
  agentSentences: AgentSentence[],
): SentenceSentiment[] {
  const { stripped, indexMap } = stripWhitespace(originalText);
  const results: SentenceSentiment[] = [];
  let searchCursor = 0;
  for (const sentence of agentSentences) {
    const normalizedTarget = sentence.text.replace(/\s/g, "");
    if (normalizedTarget.length === 0) {
      continue;
    }
    const matchIndex = stripped.indexOf(normalizedTarget, searchCursor);
    if (matchIndex === -1) {
      continue;
    }
    const start = indexMap[matchIndex];
    const lastStrippedIndex = matchIndex + normalizedTarget.length - 1;
    const end = indexMap[lastStrippedIndex] + 1;
    results.push({ start, end, score: sentence.score });
    searchCursor = matchIndex + normalizedTarget.length;
  }
  return results;
}
