import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(rating, comment);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const handleRatingChange = (rating: number) => {
    setRating(rating);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  return (
    <div>
      <div>
        {/* Content of the modal */}
        <div>
          <h2>Rate the product</h2>
          
          {/* Rating component */}
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} onClick={() => handleRatingChange(star)}>
                {star <= rating ? '★' : '☆'}
              </span>
            ))}
          </div>
          
          {/* Comment section */}
          <div>
            <textarea onChange={handleCommentChange} value={comment} placeholder="Leave your comment" />
          </div>

          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
