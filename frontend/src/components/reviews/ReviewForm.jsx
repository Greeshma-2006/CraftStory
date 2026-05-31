import React, {
  useState,
} from 'react';

import {
  Star,
} from 'lucide-react';

const ReviewForm = ({
  onSubmit,
}) => {

  const [rating,
    setRating] =
    useState(5);

  const [review,
    setReview] =
    useState('');

  const handleSubmit =
    (e) => {

      e.preventDefault();

      onSubmit({
        rating,
        review,
      });

      setReview('');
      setRating(5);
    };

  return (

    <div className="bg-white rounded-[35px] shadow-xl p-8">

      <h2 className="text-3xl font-bold text-[#6B3E2E] mb-6">

        Write A Review

      </h2>

      <div className="flex gap-2 mb-6">

        {[1,2,3,4,5].map(
          (star) => (

            <button
              key={star}
              type="button"
              onClick={() =>
                setRating(
                  star
                )
              }
            >

              <Star
                size={32}
                className={
                  star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />

            </button>
          )
        )}

      </div>

      <form
        onSubmit={
          handleSubmit
        }
      >

        <textarea
          rows="5"
          value={review}
          onChange={(e) =>
            setReview(
              e.target.value
            )
          }
          placeholder="Share your experience..."
          className="w-full border border-[#E7D5C7] rounded-2xl p-4"
          required
        />

        <button
          type="submit"
          className="mt-6 bg-[#C96A4A] hover:bg-[#A44A32] text-white px-8 py-4 rounded-full"
        >

          Submit Review

        </button>

      </form>

    </div>
  );
};

export default ReviewForm;