import type { Review } from "../types.ts";

type Props = {
  /** レビュー */
  review: Review;
};

/** レビューカード */
export const ReviewCard = ({ review }: Props) => (
  <li>
    <article className="review-card">
      <div className="review-meta">
        <span>{review.date}</span>
      </div>
      <p className="review-body" data-review-id={review.id}>
        {review.text}
      </p>
    </article>
  </li>
);
