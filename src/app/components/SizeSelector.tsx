'use client';

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
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const currentSize = searchParams.get('Size');

  if (sizes.length === 0) return null;

  const updateSearchParams = (size: string) => {
    if (size === '') return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('Size');
    newParams.append('Size', size);
    router.replace(
      `/${params.category}/${params.subcategory}/${
        params.id
      }?${newParams.toString()}`,
      { scroll: false },
    );
  };

  return (
    <div className='my-4'>
      <h3>Sizes</h3>
      <ToggleGroup
        type='single'
        className='flex flex-wrap justify-start'
        // value={sizeState}
        value={currentSize ?? ''}
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
