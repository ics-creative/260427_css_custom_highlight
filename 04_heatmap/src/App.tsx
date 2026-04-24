import { useState } from "react";
import { FullScreenLoading } from "./components/FullScreenLoading.tsx";
import { ReviewList } from "./components/ReviewList.tsx";
import { Toolbar } from "./components/Toolbar.tsx";
import { getReviews } from "./logics/getReviews.ts";
import {
  applySentimentHighlights,
  clearHighlight,
} from "./logics/highlightText.ts";
import { analyzeReviews, hasMastraServerUrl } from "./logics/mastraClient.ts";

export function App() {
  const [analyzing, setAnalyzing] = useState(false);
  const [isJapanese, setIsJapanese] = useState<boolean>(true);
  const displayReviews = getReviews(isJapanese);
  const [hasError, setHasError] = useState(false);

  const onLanguageChange = () => {
    setIsJapanese(!isJapanese);
    clearHighlight();
  };

  /**
   * レビューを分析してハイライトする
   */
  const handleAnalyze = async (): Promise<void> => {
    setAnalyzing(true);
    try {
      const response = await analyzeReviews(getReviews(isJapanese));
      applySentimentHighlights(response);
      setHasError(false);
    } catch {
      clearHighlight();
      setHasError(true);
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeDisabled = analyzing || !hasMastraServerUrl();

  return (
    <>
      {analyzing && <FullScreenLoading />}
      {hasError && (
        <p className="error-message">
          エラーが発生しました。時間をおいて再度試してください。
        </p>
      )}
      <div className="lang-toggle">
        <div className="lang-toggle__row">
          <span
            className={`lang-toggle__caption${isJapanese ? " lang-toggle__caption--active" : ""}`}
          >
            日本語
          </span>
          <button
            type="button"
            className="lang-toggle__switch"
            role="switch"
            aria-checked={isJapanese}
            aria-labelledby="lang-toggle-desc"
            onClick={() => onLanguageChange()}
          >
            <span className="lang-toggle__thumb" data-on={isJapanese} />
          </button>
          <span
            className={`lang-toggle__caption${!isJapanese ? " lang-toggle__caption--active" : ""}`}
          >
            English
          </span>
        </div>
      </div>
      {isJapanese ? (
        <p className="app-lead">
          映画の感想をネガティブ-ポジティブの5段階感情スコアでハイライトします。
        </p>
      ) : (
        <p className="app-lead">
          Movie reviews are highlighted using a five-level sentiment score
          ranging from negative to positive.
        </p>
      )}
      <Toolbar disabled={analyzeDisabled} onAnalyze={handleAnalyze} />
      <ReviewList reviews={displayReviews} />
    </>
  );
}
