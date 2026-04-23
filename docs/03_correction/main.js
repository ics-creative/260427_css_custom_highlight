const rules = [
  { pattern: /\bvery\b/gi },
  { pattern: /\b(really|just)\b/gi },
  { pattern: /[\uFF61-\uFF9F]+/g },
  { pattern: /[\uFF21-\uFF3A\uFF41-\uFF5A\uFF10-\uFF19]+/g },
  { pattern: /だと思います/g },
];

const editor = document.querySelector(".editor");
const preview = document.querySelector(".preview");

/**
 * プレビューを更新する
 */
const render = () => {
  // 入力値をプレビューに反映
  preview.textContent = editor.value;
  const previewTextNode = preview.firstChild;
  if (previewTextNode === null) {
    // プレビューが空の場合はハイライトを削除
    CSS.highlights.delete("correction");
    return;
  }

  const targetText = previewTextNode.textContent;
  const ranges = [];
  for (const rule of rules) {
    for (const matchResult of targetText.matchAll(rule.pattern)) {
      const matchedText = matchResult[0];
      if (matchedText.length === 0) continue;
      // ②ルールに一致した範囲を作成
      const range = new Range();
      range.setStart(previewTextNode, matchResult.index);
      range.setEnd(previewTextNode, matchResult.index + matchedText.length);
      ranges.push(range);
    }
  }

  if (ranges.length === 0) {
    CSS.highlights.delete("correction");
    return;
  }

  // ③ルールに一致した部分をハイライト
  CSS.highlights.set("correction", new Highlight(...ranges));
};

// ①入力イベントを監視してプレビューを更新
editor.addEventListener("input", render);

render();
