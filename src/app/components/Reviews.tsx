'use client';
import { useRef, useState } from 'react';
import { useDispatch, useStore } from 'react-redux';

import { revalidatePath } from 'next/cache';
import { useParams } from 'next/navigation';

import { Review } from '@/api/types';
import { setReviews, RootState } from '../../store/store';
import { useReviews } from '../../hooks';

export default function Reviews({
  reviews: initialReviews,
  addReviewAction,
  productId: id,
}: {
  productId: string;
  reviews: Review[];
  addReviewAction: (
    id: string,
    text: string,
    rating: number,
    userId: string,
  ) => Promise<Review[]>;
}) {
  const store = useStore<RootState>();
  const initialized = useRef(false);
  if (!initialized.current) {
    store.dispatch(setReviews(initialReviews));
    initialized.current = true;
  }
  const reviews = useReviews();
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const dispatch = useDispatch();

  const params = useParams();
  const { category, subcategory } = params;

  return (
    <div className='w-full p-4'>
      {reviews?.map((review, index) => (
        <div key={index} className='p-5'>
          <div className='my-1 text-md leading-5 text-gray-300'>
            {review.rating} stars
          </div>
          <div className='mt-1 text-sm leading-5 text-gray-300 font-light italic'>
            {review.text}
          </div>
        </div>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // Here i need to do some logicto retrive the user id from cookies
          dispatch(
            setReviews(await addReviewAction(id, reviewText, reviewRating, '')),
          );
          revalidatePath(`/${category}/${subcategory}/${id}`);
          setReviewText('');
          setReviewRating(5);
        }}
      >
        <div className='flex flex-row gap-2 items-center'>
          <label htmlFor='review-text'>Review</label>
          <input
            id='review-text'
            className='p-2 border border-gray-300 rounded-md bg-gray-900 text-white flex-grow'
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <label htmlFor='review-rating'>Rating</label>
          <input
            id='review-rating'
            className='p-2 border border-gray-300 rounded-md bg-gray-900 text-white'
            type='number'
            min={1}
            max={5}
            value={reviewRating}
            onChange={(e) => setReviewRating(+e.target.value)}
          />
        </div>
        <div className='flex justify-end'>
          <button
            disabled={!reviewText}
            className='mt-6 px-8 py-2 text-lg font-bold text-white bg-blue-800 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed'
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
}
