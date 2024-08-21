'use client';
import { MouseEvent } from 'react';
import { useRef } from 'react';

import { useDispatch, useStore } from 'react-redux';
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
  const store = useStore<RootState>();
  const initialized = useRef(false);
  if (!initialized.current) {
    store.dispatch(setSize(''));
    initialized.current = true;
  }

  const dispatch = useDispatch();

  if (sizes.length === 0) return null;

  const handleSizeClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    const size = e.currentTarget.innerText;
    if (availableSizes.includes(size)) {
      dispatch(setSize(size));
    }
  };

  return (
    <div className='my-4'>
      <h3>Sizes</h3>
      <ToggleGroup type='single' className='flex flex-wrap justify-start'>
        {sizes.map((size) => (
          <ToggleGroupItem
            key={size}
            value={size}
            aria-label={`Toggle ${size}`}
            onClick={(e) => handleSizeClick(e)}
            disabled={!availableSizes.includes(size)}
          >
            {size}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
