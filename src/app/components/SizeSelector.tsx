'use client';

// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, setSize } from '../../store/store';

import { ToggleGroup, ToggleGroupItem } from '@/app/components/ui/toggle-group';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

interface Props {
  sizes: string[];
  availableSizes: string[];
}

export default function SizeSelector({
  sizes,
  availableSizes,
}: Readonly<Props>) {
  // const sizeState = useSelector(
  //   (state: RootState) => state.selectedProduct.selectedProduct.size,
  // );
  // const dispatch = useDispatch();
  //
  // if (sizes.length === 0) return null;
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const size = searchParams.get('Size');

  if (sizes.length === 0) return null;

  const updateSearchParams = (size: string) => {
    if (size === '') return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('Size');
    newParams.append('Size', size);
    router.push(
      `/${params.category}/${params.subcategory}/${
        params.id
      }?${newParams.toString()}`,
    );
  };

  return (
    <div className='my-4'>
      <h3>Sizes</h3>
      <ToggleGroup
        type='single'
        className='flex flex-wrap justify-start'
        // value={sizeState}
        value={size ?? ''}
        // onValueChange={(value) => dispatch(setSize(value))}
        onValueChange={(value) => updateSearchParams(value)}
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
