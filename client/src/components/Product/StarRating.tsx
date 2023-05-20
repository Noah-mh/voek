import React from 'react';

interface StarRatingProps {
    rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    return (
        <div>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`text-xl mx-1 ${star <= rating ? 'text-yellow-500' : ''}`}
                >
                    {star <= rating ? '★' : '☆'}
                </span>
            ))}
        </div>
    );
};

export default StarRating;
