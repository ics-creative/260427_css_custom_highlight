const article = document.querySelector(".article");
const searchInput = document.querySelector(".search-input");

const textNodes = [];
const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
let currentNode = walker.nextNode();
while (currentNode !== null) {
  textNodes.push(currentNode);
  currentNode = walker.nextNode();
}

const updateHighlight = () => {
  const keyword = searchInput.value;
  if (keyword === "") {
    CSS.highlights.delete("search");
    return;
  }

  const ranges = [];
  const lowerKeyword = keyword.toLowerCase();
  const keywordLength = keyword.length;

  for (const textNode of textNodes) {
    const lowerText = textNode.textContent.toLowerCase();
    let startIndex = 0;
    while (startIndex <= lowerText.length - keywordLength) {
      const foundIndex = lowerText.indexOf(lowerKeyword, startIndex);
      if (foundIndex === -1) {
        break;
      }
      const range = new Range();
      range.setStart(textNode, foundIndex);
      range.setEnd(textNode, foundIndex + keywordLength);
      ranges.push(range);
      startIndex = foundIndex + keywordLength;
    }
  }

  if (ranges.length === 0) {
    CSS.highlights.delete("search");
    return;
  }

  CSS.highlights.set("search", new Highlight(...ranges));
};

searchInput.addEventListener("input", updateHighlight);
