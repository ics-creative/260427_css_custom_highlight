import { SEED_REVIEWS } from "../data/seedReviews";
import type { Review } from "../types";

/**
 * レビューを取得する
 * @param isJapanese
 * @returns
 */
export const getReviews = (isJapanese: boolean): Review[] => {
  return SEED_REVIEWS.map((review) => ({
    id: review.id,
    text: isJapanese ? review["text-jp"] : review["text-en"],
    date: review.date,
  }));
};
