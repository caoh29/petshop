import AverageRating from '@/app/components/AverageRating';

import { capitalizeString } from '@/lib/utils';

import { Badge } from './ui/badge';
import { Review } from '@/api/types';

interface Props {
  className?: string;
  productName: string;
  category: string;
  subcategory: string;
  reviews: Review[];
}

export default function ProductDetailsHeader({
  className,
  productName,
  category,
  subcategory,
  reviews,
}: Readonly<Props>) {
  return (
    <div className={`${className ?? ''} space-y-2`}>
      <h1 className='text-3xl text-muted font-bold'>{productName}</h1>
      <div className='flex items-center space-x-2'>
        <Badge variant='secondary'>{capitalizeString(category)}</Badge>
        <Badge variant='secondary'>{capitalizeString(subcategory)}</Badge>
      </div>
      <AverageRating reviews={reviews} />
    </div>
  );
}
