'use client';
import { useRef } from 'react';

import { useDispatch, useSelector, useStore } from 'react-redux';
import { resetProductState, RootState, setSize } from '@/lib/store/store';

import { ToggleGroup, ToggleGroupItem } from '@/app/components/ui/toggle-group';

interface Props {
  sizes: string[];
  availableSizes: string[];
}

export default function SizeSelector({
  sizes,
  availableSizes,
}: Readonly<Props>) {
  const store = useStore<RootState>();
  const initialized = useRef(false);
  if (!initialized.current) {
    store.dispatch(resetProductState());
    initialized.current = true;
  }

  const sizeState = useSelector(
    (state: RootState) => state.product.product.size,
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
