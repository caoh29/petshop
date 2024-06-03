'use client';
import { useStore } from 'react-redux';
import { useRef } from 'react';

import { Review } from '@/api/types';
import { setReviews, RootState } from '@/lib/store/store';
import { useReviews } from '@/lib/hooks';

export default function AverageRating({
  reviews: initialReviews,
}: {
  reviews: Review[];
}) {
  const store = useStore<RootState>();
  const initialized = useRef(false);
  if (!initialized.current) {
    store.dispatch(setReviews(initialReviews));
    initialized.current = true;
  }
  const reviews = useReviews();

  return (
    <>
      {reviews && reviews?.length && (
        <div className='mt-4 font-light'>
          Average Rating:{' '}
          {(
            reviews?.reduce((a, b) => a + b.rating, 0) / reviews?.length
          ).toFixed(1)}
        </div>
      )}
    </>
  );
}
