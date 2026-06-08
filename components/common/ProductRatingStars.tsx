type ProductRatingStarsProps = {
  rating: number;
  className?: string;
};

const STAR_COUNT = 5;

function clampRating(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(STAR_COUNT, Math.max(0, value));
}

type StarVisual = "full" | "partial" | "empty";

function starVisual(
  rating: number,
  index: number,
): { kind: StarVisual; fillPercent: number } {
  const starNumber = index + 1;
  if (rating >= starNumber) {
    return { kind: "full", fillPercent: 100 };
  }
  if (rating <= index) {
    return { kind: "empty", fillPercent: 0 };
  }
  return { kind: "partial", fillPercent: (rating - index) * 100 };
}

export function ProductRatingStars({
  rating: ratingProp,
  className = "star-wrap normal d-flex align-items-center",
}: ProductRatingStarsProps) {
  const rating = clampRating(ratingProp);

  return (
    <div className={className} aria-label={`${rating} out of ${STAR_COUNT} stars`}>
      {Array.from({ length: STAR_COUNT }).map((_, index) => {
        const { kind, fillPercent } = starVisual(rating, index);

        if (kind === "full") {
          return (
            <i
              key={`${rating}-star-${index}`}
              className="icon icon-Star active"
              aria-hidden
            />
          );
        }

        if (kind === "empty") {
          return (
            <i key={`${rating}-star-${index}`} className="icon icon-Star" aria-hidden />
          );
        }

        return (
          <span key={`${rating}-star-${index}`} className="star-partial">
            <i className="icon icon-Star" aria-hidden />
            <span
              className="star-partial-fill"
              style={{ width: `${fillPercent}%` }}
              aria-hidden
            >
              <i className="icon icon-Star active" />
            </span>
          </span>
        );
      })}
    </div>
  );
}