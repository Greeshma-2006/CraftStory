import React from 'react';

import {
  Star,
} from 'lucide-react';

const ReviewList = ({
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
}) => {

  return (

    <div className="bg-white rounded-[35px] shadow-xl p-8">

      <h2 className="text-3xl font-bold text-[#6B3E2E] mb-8">

        Reviews & Ratings

      </h2>

      <div className="mb-10">

        <div className="flex items-center gap-4">

          <h3 className="text-5xl font-bold text-[#6B3E2E]">

            {averageRating}

          </h3>

          <Star
            className="fill-yellow-400 text-yellow-400"
            size={40}
          />

        </div>

        <p className="text-[#6B3E2E]/70 mt-2">

          {totalReviews}
          {' '}
          Reviews

        </p>

      </div>

      {[5,4,3,2,1].map(
        (star) => (

          <div
            key={star}
            className="flex items-center gap-4 mb-3"
          >

            <span>
              {star}★
            </span>

            <div className="flex-1 h-3 bg-[#F5E6D3] rounded-full">

              <div
                className="h-3 bg-[#C96A4A] rounded-full"
                style={{
                  width:
                    totalReviews > 0
                      ? `${(
                          ratingDistribution[
                            star
                          ] /
                          totalReviews
                        ) * 100}%`
                      : '0%',
                }}
              />

            </div>

            <span>

              {
                ratingDistribution[
                  star
                ]
              }

            </span>

          </div>
        )
      )}

      <div className="mt-10 space-y-6">

        {reviews.map(
          (item) => (

            <div
              key={
                item._id
              }
              className="border-b border-[#F5E6D3] pb-6"
            >

              <h4 className="font-bold text-[#6B3E2E]">

                {
                  item.user?.name
                }

              </h4>

              <div className="flex mt-2 mb-2">

                {[
                  1,2,3,4,5
                ].map(
                  (
                    star
                  ) => (

                    <Star
                      key={star}
                      size={16}
                      className={
                        star <=
                        item.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  )
                )}

              </div>

              <p className="text-[#6B3E2E]/80">

                {
                  item.review
                }

              </p>

            </div>
          )
        )}

      </div>

    </div>
  );
};

export default ReviewList;