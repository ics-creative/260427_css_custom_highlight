type Props = {
  disabled: boolean;
  onAnalyze: () => void;
};

/**
 * AI判定
 */
export function Toolbar({ disabled, onAnalyze }: Props) {
  return (
    <div className="toolbar">
      <button
        type="button"
        id="analyze-btn"
        disabled={disabled}
        onClick={onAnalyze}
      >
        Analyze - 分析する
      </button>
      <div className="status">
        <p className="status-label">
          <span>Positive</span>↔︎<span>Nevative</span>
        </p>
        <div className="sentiments">
          <span className="sentiment sentiment-1"></span>
          <span className="sentiment sentiment-2"></span>
          <span className="sentiment sentiment-3"></span>
          <span className="sentiment sentiment-4"></span>
          <span className="sentiment sentiment-5"></span>
        </div>
      </div>
    </div>
  );
}
