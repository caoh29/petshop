'use client';

import { useRef, useState } from 'react';
// import { useDispatch, useStore } from 'react-redux';
import { Star } from 'lucide-react';

import type { Review } from '@/types/types';
// import { setReviews, type RootState } from '../../store/store';
// import { useReviews } from '../../hooks';
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
import { Label } from './ui/label';
import { addReviewAction } from '../api/actions';

interface Props {
  productId: string;
  reviews: Review[];
  userId: string | null;
  className?: string;
}

export default function Reviews({
  // reviews: initialReviews,
  reviews,
  productId,
  userId,
  className,
}: Readonly<Props>) {
  // redux state management for reviews
  // const store = useStore<RootState>();
  // const initialized = useRef(false);
  // if (!initialized.current) {
  //   store.dispatch(setReviews(initialReviews));
  //   initialized.current = true;
  // }
  // const reviews = useReviews();
  // const dispatch = useDispatch();

  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div
      className={`${
        className ?? ''
      } w-full max-w-screen-lg p-6 md:p-12 space-y-8`}
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl sm:text-4xl font-bold text-muted'>Reviews</h2>
        {reviews && (
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <
                    Math.round(
                      reviews.reduce((acc, rev) => acc + rev.rating, 0) /
                        reviews.length,
                    )
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span>({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {reviews?.map((review) => (
        <Card
          key={review.id}
          className='shadow-md hover:shadow-lg transition-shadow duration-200 bg-primary'
        >
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='h-8 w-8 rounded-full bg-ternary/10 flex items-center justify-center'>
                  <span className='text-ternary font-semibold'>
                    {review.userId.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className='flex'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className='text-sm text-white'>{review.createdAt}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-white leading-relaxed'>{review.text}</p>
          </CardContent>
        </Card>
      ))}

      <Card className='mt-8 shadow-lg bg-primary'>
        <CardHeader>
          <CardTitle className='text-xl text-white'>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!userId || isSubmitting) return;

              setIsSubmitting(true);
              try {
                // dispatch(
                //   setReviews(
                await addReviewAction(
                  productId,
                  reviewText,
                  reviewRating,
                  userId,
                );
                //   ),
                // );
                setReviewText('');
                setReviewRating(5);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className='space-y-6'
          >
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-white'>
                Your Review
              </Label>
              <Textarea
                placeholder='Share your thoughts about this product...'
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className='min-h-[120px] resize-none focus:ring-2 focus:ring-primary/20 text-black placeholder:text-gray-500'
              />
            </div>
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-white'>Rating</Label>
              <Select
                value={reviewRating.toString()}
                onValueChange={(value) => setReviewRating(Number(value))}
              >
                <SelectTrigger className='w-full sm:w-[200px]'>
                  <SelectValue placeholder='Select a rating'>
                    <div className='flex items-center gap-2'>
                      <span>{reviewRating}</span>
                      <div className='flex'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < reviewRating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem
                      key={rating}
                      value={rating.toString()}
                      className='flex items-center gap-2'
                    >
                      <div className='flex items-center gap-2'>
                        <span>{rating}</span>
                        <div className='flex'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex justify-end'>
              <Button
                type='submit'
                disabled={!reviewText || !userId || isSubmitting}
                className='px-8 py-2 text-lg font-semibold transition-colors duration-200'
                variant={'secondary'}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
