import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating, count }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill="var(--primary)"
          color="var(--primary)"
          style={{ marginRight: '2px' }}
        />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <div key={i} style={{ display: 'inline-block', position: 'relative', width: '16px', height: '16px', marginRight: '2px' }}>
          <Star size={16} color="rgba(255,255,255,0.15)" />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
            <Star size={16} fill="var(--primary)" color="var(--primary)" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star
          key={i}
          size={16}
          color="rgba(255, 255, 255, 0.15)"
          style={{ marginRight: '2px' }}
        />
      );
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {stars}
      {rating > 0 && (
        <span style={{ marginLeft: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
          {rating.toFixed(1)} {count !== undefined && `(${count} reviews)`}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
