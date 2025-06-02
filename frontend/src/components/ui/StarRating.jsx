import { useState } from "react";
import { Star } from "lucide-react";
import "./icon.css";

export default function StarRating({ initialRating = 0, onRate, disabled }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(initialRating);

  const renderStar = (index) => {
    const ratingToShow = hoverRating || currentRating;
    return ratingToShow >= index + 1 ? (
      <Star key={index} fill="yellow" strokeWidth={0} />
    ) : (
      <Star key={index} fill="none" stroke="yellow" strokeWidth={1} />
    );
  };

  const handleClick = (index) => {
    if (disabled) return;
    const newRating = index + 1;
    setCurrentRating(newRating);
    if (onRate) onRate(newRating);
  };

  return (
    <div
      className="star-rating"
      style={{ display: "flex", gap: "4px", cursor: disabled ? "default" : "pointer" }}
    >

      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i + 1}
          style={{ width: 24, height: 24 }}
          onMouseEnter={() => !disabled && setHoverRating(i + 1)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
          onClick={() => handleClick(i)}
        >
          {renderStar(i)}
        </div>
      ))}
    </div>
  );
}
