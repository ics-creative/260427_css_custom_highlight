const article = document.querySelector(".article");
const searchInput = document.querySelector(".search-input");

// ①読み込み時にテキストノードを取得しておく
const textNodes = [];
const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
let currentNode = walker.nextNode();
while (currentNode !== null) {
  textNodes.push(currentNode);
  currentNode = walker.nextNode();
}

/**
 * ハイライトを更新する
 */
const updateHighlight = () => {
  const keyword = searchInput.value;
  if (keyword === "") {
    // キーワードが空の場合はハイライトを削除
    CSS.highlights.delete("search");
    return;
  }

  const ranges = [];
  const regex = new RegExp(RegExp.escape(keyword), "gi");
  // テキストノードをループ
  for (const textNode of textNodes) {
    for (const match of textNode.textContent.matchAll(regex)) {
      // キーワードに一致する範囲を作成
      const range = new Range();
      range.setStart(textNode, match.index);
      range.setEnd(textNode, match.index + match[0].length);
      ranges.push(range);
    }
  }

  if (ranges.length === 0) {
    // キーワードに一致する部分が見つからなかった場合はハイライトを削除
    CSS.highlights.delete("search");
    return;
  }

  // キーワードに一致する部分をハイライト
  CSS.highlights.set("search", new Highlight(...ranges));
};

// 入力イベントを監視してハイライトを更新
searchInput.addEventListener("input", updateHighlight);
