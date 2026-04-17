const rules = [
  { id: "filler-very", pattern: /\bvery\b/gi },
  { id: "filler-really-just", pattern: /\b(really|just)\b/gi },
  { id: "double-space", pattern: / {2,}/g },
  {
    id: "passive-voice",
    pattern: /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi,
  },
  { id: "trailing-space", pattern: /[ \t]+$/gm },
  { id: "redundant-suru", pattern: /することができ(る|ます)/g },
  { id: "itadaku-kanji", pattern: /頂(く|き|け|こ|い)/g },
  { id: "han-kana", pattern: /[\uFF61-\uFF9F]+/g },
  { id: "zen-alnum", pattern: /[\uFF21-\uFF3A\uFF41-\uFF5A\uFF10-\uFF19]+/g },
  { id: "omoimasu", pattern: /だと思います/g },
];

const editor = document.querySelector(".editor");
const preview = document.querySelector(".preview");
const ruleCheckboxes = document.querySelectorAll(".rule-checkbox");

const collectEnabledRules = () => {
  const enabled = [];
  for (const rule of rules) {
    const checkbox = document.getElementById(rule.id);
    if (checkbox?.checked) {
      enabled.push(rule);
    }
  }
  return enabled;
};

const render = () => {
  preview.textContent = editor.value;
  const previewTextNode = preview.firstChild;
  if (previewTextNode === null) {
    CSS.highlights.delete("correction");
    return;
  }

  const targetText = previewTextNode.textContent;
  const enabledRules = collectEnabledRules();
  const ranges = [];

  for (const rule of enabledRules) {
    rule.pattern.lastIndex = 0;
    let matchResult = rule.pattern.exec(targetText);
    while (matchResult !== null) {
      const matchedText = matchResult[0];
      if (matchedText.length > 0) {
        const range = new Range();
        range.setStart(previewTextNode, matchResult.index);
        range.setEnd(previewTextNode, matchResult.index + matchedText.length);
        ranges.push(range);
      } else {
        rule.pattern.lastIndex += 1;
      }
      matchResult = rule.pattern.exec(targetText);
    }
  }

  if (ranges.length === 0) {
    CSS.highlights.delete("correction");
    return;
  }

  CSS.highlights.set("correction", new Highlight(...ranges));
};

editor.addEventListener("input", render);
for (const checkbox of ruleCheckboxes) {
  checkbox.addEventListener("change", render);
}

render();
