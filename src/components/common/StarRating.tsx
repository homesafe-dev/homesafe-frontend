import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 18,
  showValue = false,
  reviewCount,
  className = '',
}) => {
  const safeRating = Math.max(0, Math.min(5, rating));

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, index) => {
          const fill = Math.max(0, Math.min(1, safeRating - index));

          return (
            <div
              key={index}
              className="relative"
              style={{ width: size, height: size }}
            >
              <Star
                className="text-gray-300 absolute inset-0"
                style={{ width: size, height: size }}
              />
              {fill > 0 && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star
                    className="text-yellow-400 fill-yellow-400"
                    style={{ width: size, height: size }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showValue && safeRating > 0 && (
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-0.5">
          ({safeRating.toFixed(1)}
          {reviewCount !== undefined && reviewCount > 0
            ? ` · ${reviewCount} review${reviewCount === 1 ? '' : 's'}`
            : ''}
          )
        </span>
      )}
    </div>
  );
};

export default StarRating;
