'use client';
import { useRef } from 'react';

import { useDispatch, useSelector, useStore } from 'react-redux';
import { resetProductState, RootState, setColor } from '@/lib/store/store';

import { ToggleGroup, ToggleGroupItem } from '@/app/components/ui/toggle-group';

interface Props {
  colors: string[];
  availableColors: string[];
}

export default function ColorSelector({
  colors,
  availableColors,
}: Readonly<Props>) {
  const store = useStore<RootState>();
  const initialized = useRef(false);
  if (!initialized.current) {
    store.dispatch(resetProductState());
    initialized.current = true;
  }

  const colorState = useSelector(
    (state: RootState) => state.selectedProduct.selectedProduct.color,
  );
  const dispatch = useDispatch();

  if (colors.length === 0) return null;

  return (
    <div className='my-4'>
      <h3>Colors</h3>
      <ToggleGroup
        type='single'
        className='flex flex-wrap justify-start'
        value={colorState}
        onValueChange={(value) => dispatch(setColor(value))}
      >
        {colors.map((color) => (
          <ToggleGroupItem
            key={color}
            value={color}
            aria-label={`Toggle ${color}`}
            disabled={!availableColors.includes(color)}
          >
            {color}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
