'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, setSize } from '@/lib/store/store';

import { ToggleGroup, ToggleGroupItem } from '@/app/components/ui/toggle-group';

interface Props {
  sizes: string[];
  availableSizes: string[];
}

export default function SizeSelector({
  sizes,
  availableSizes,
}: Readonly<Props>) {
  const sizeState = useSelector(
    (state: RootState) => state.selectedProduct.selectedProduct.size,
  );
  const dispatch = useDispatch();

  if (sizes.length === 0) return null;

  return (
    <div className='my-4'>
      <h3>Sizes</h3>
      <ToggleGroup
        type='single'
        className='flex flex-wrap justify-start'
        value={sizeState}
        onValueChange={(value) => dispatch(setSize(value))}
      >
        {sizes.map((size) => (
          <ToggleGroupItem
            key={size}
            value={size}
            aria-label={`Toggle ${size}`}
            disabled={!availableSizes.includes(size)}
          >
            {size}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
