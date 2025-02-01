'use client';

// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, setColor } from '../../store/store';

import { ToggleGroup, ToggleGroupItem } from '@/app/components/ui/toggle-group';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

interface Props {
  colors: string[];
  availableColors: string[];
}

export default function ColorSelector({
  colors,
  availableColors,
}: Readonly<Props>) {
  // const colorState = useSelector(
  //   (state: RootState) => state.selectedProduct.selectedProduct.color,
  // );
  // const dispatch = useDispatch();

  // if (colors.length === 0) return null;

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const currentColor = searchParams.get('Color');

  if (colors.length === 0) return null;

  const updateSearchParams = (color: string) => {
    if (color === '') return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('Color');
    newParams.append('Color', color);
    router.replace(
      `/${params.category}/${params.subcategory}/${
        params.id
      }?${newParams.toString()}`,
      { scroll: false },
    );
  };

  return (
    <div className='my-4'>
      <h3>Colors</h3>
      <ToggleGroup
        type='single'
        className='flex flex-wrap justify-start'
        // value={colorState}
        // onValueChange={(value) => dispatch(setColor(value))}
        value={currentColor ?? ''}
        onValueChange={(value) => updateSearchParams(value)}
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
