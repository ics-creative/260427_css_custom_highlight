import type { Review } from "../types.ts";
import { ReviewCard } from "./ReviewCard.tsx";

type Props = {
  /** レビュー一覧 */
  reviews: Review[];
};

/**
 * レビュー一覧
 */
export const ReviewList = ({ reviews }: Props) => (
  <ul className="review-list">
    {reviews.map((review) => (
      <ReviewCard key={review.id} review={review} />
    ))}
  </ul>
);
