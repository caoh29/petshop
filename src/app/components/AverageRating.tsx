// 'use client';
// import { useStore } from 'react-redux';
// import { useRef } from 'react';

// import { setReviews, RootState } from '../../store/store';
// import { useReviews } from '../../hooks';
import { Review } from '@/types/types';
import { Star } from 'lucide-react';

interface Props {
  reviews: Review[];
}

export default function AverageRating({
  // reviews: initialReviews,
  reviews,
}: Readonly<Props>) {
  // const store = useStore<RootState>();
  // const initialized = useRef(false);
  // if (!initialized.current) {
  //   store.dispatch(setReviews(initialReviews));
  //   initialized.current = true;
  // }
  // const reviews = useReviews();

  return (
    <>
      {reviews && reviews?.length > 0 && (
        <div className='mt-4 font-light flex flex-row flex-nowrap items-center gap-2'>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i <
                  reviews.reduce((acc, rev) => acc + rev.rating, 0) /
                    reviews.length
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          {(
            reviews?.reduce((a, b) => a + b.rating, 0) / reviews?.length
          ).toFixed(1)}
          <span>
            | {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>
      )}
    </>
  );
}
