// 'use client';
// import { useRef, useState } from 'react';
// import { useDispatch, useStore } from 'react-redux';

// import { Review } from '@/api/types';
// import { setReviews, RootState } from '../../store/store';
// import { useReviews } from '../../hooks';

// interface Props {
//   productId: string;
//   reviews: Review[];
//   addReviewAction: (
//     id: string,
//     text: string,
//     rating: number,
//     userId: string,
//   ) => Promise<Review[]>;
//   userId: string | null;
// }

// export default function Reviews({
//   reviews: initialReviews,
//   addReviewAction,
//   productId,
//   userId,
// }: Readonly<Props>) {
//   const store = useStore<RootState>();
//   const initialized = useRef(false);
//   if (!initialized.current) {
//     store.dispatch(setReviews(initialReviews));
//     initialized.current = true;
//   }
//   const reviews = useReviews();
//   const [reviewText, setReviewText] = useState('');
//   const [reviewRating, setReviewRating] = useState(5);

//   const dispatch = useDispatch();

//   return (
//     <div className='w-full p-4'>
//       {reviews?.map((review) => (
//         <div key={review.id} className='p-5'>
//           <div className='my-1 text-md leading-5 text-gray-300'>
//             {review.rating} stars
//           </div>
//           <div className='mt-1 text-sm leading-5 text-gray-300 font-light italic'>
//             {review.text}
//           </div>
//         </div>
//       ))}
//       <form
//         onSubmit={async (e) => {
//           e.preventDefault();
//           if (!userId) return;

//           dispatch(
//             setReviews(
//               await addReviewAction(
//                 productId,
//                 reviewText,
//                 reviewRating,
//                 userId,
//               ),
//             ),
//           );
//           setReviewText('');
//           setReviewRating(5);
//         }}
//       >
//         <div className='flex flex-row gap-2 items-center'>
//           <label htmlFor='review-text'>Review</label>
//           <input
//             id='review-text'
//             className='p-2 border border-gray-300 rounded-md bg-gray-900 text-white flex-grow'
//             value={reviewText}
//             onChange={(e) => setReviewText(e.target.value)}
//           />
//           <label htmlFor='review-rating'>Rating</label>
//           <input
//             id='review-rating'
//             className='p-2 border border-gray-300 rounded-md bg-gray-900 text-white'
//             type='number'
//             min={1}
//             max={5}
//             step={1}
//             value={reviewRating}
//             onChange={(e) => setReviewRating(+e.target.value)}
//           />
//         </div>
//         <div className='flex justify-end'>
//           <button
//             disabled={!reviewText || !userId}
//             className='mt-6 px-8 py-2 text-lg font-bold text-white bg-blue-800 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed'
//           >
//             Submit Review
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

'use client';
import { useRef, useState } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { Star } from 'lucide-react';

import type { Review } from '@/api/types';
import { setReviews, type RootState } from '../../store/store';
import { useReviews } from '../../hooks';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';

interface Props {
  productId: string;
  reviews: Review[];
  addReviewAction: (
    id: string,
    text: string,
    rating: number,
    userId: string,
  ) => Promise<Review[]>;
  userId: string | null;
}

export default function Reviews({
  reviews: initialReviews,
  addReviewAction,
  productId,
  userId,
}: Readonly<Props>) {
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

  return (
    <div className='w-full p-4 space-y-6'>
      {reviews?.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <span>{review.rating}</span>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-500 italic'>{review.text}</p>
          </CardContent>
        </Card>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!userId) return;

          dispatch(
            setReviews(
              await addReviewAction(
                productId,
                reviewText,
                reviewRating,
                userId,
              ),
            ),
          );
          setReviewText('');
          setReviewRating(5);
        }}
        className='space-y-4'
      >
        <div className='space-y-2'>
          <label htmlFor='review-text' className='text-sm font-medium'>
            Review
          </label>
          <Textarea
            id='review-text'
            placeholder='Write your review here...'
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className='min-h-[100px]'
          />
        </div>
        <div className='space-y-2'>
          <label htmlFor='review-rating' className='text-sm font-medium'>
            Rating
          </label>
          <Select
            value={reviewRating.toString()}
            onValueChange={(value) => setReviewRating(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select a rating' />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} {rating === 1 ? 'Star' : 'Stars'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={!reviewText || !userId}
            className='px-8 py-2 text-lg font-bold'
          >
            Submit Review
          </Button>
        </div>
      </form>
    </div>
  );
}
