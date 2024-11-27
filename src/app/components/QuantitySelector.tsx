'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const quantity = searchParams.get('Quantity');

  let quantityState = 1;
  if (quantity) {
    quantityState = +quantity;
  }

  const updateSearchParams = (quantity: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('Quantity');
    newParams.append('Quantity', quantity.toString());
    router.replace(
      `/${params.category}/${params.subcategory}/${
        params.id
      }?${newParams.toString()}`,
      { scroll: false },
    );
  };

  return (
    <div className='my-4'>
      <h3>Quantity</h3>
      <button
        onClick={() => {
          if (quantity && +quantity > 1) {
            updateSearchParams(quantityState - 1);
          }
        }}
      >
        <Minus />
      </button>
      <span className='mx-4'>{quantityState}</span>
      <button onClick={() => updateSearchParams(quantityState + 1)}>
        <Plus />
      </button>
    </div>
  );
}
