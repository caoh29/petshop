'use client';

import { useDispatch } from 'react-redux';
import { setSize } from '@/lib/store/store';

interface Props {
  sizes: string[];
  availableSizes: string[];
}

export default function SizeSelector({
  sizes,
  availableSizes,
}: Readonly<Props>) {
  const dispatch = useDispatch();

  if (sizes.length === 0) return null;

  const handleSizeClick = (e: any) => {
    const size = e.target.innerText;
    if (availableSizes.includes(size)) {
      e.target.parentElement.childNodes.forEach((node: any) => {
        node.classList.remove('underline');
      });
      e.target.classList.add('underline');
      dispatch(setSize(size));
    }
  };

  return (
    <div className='my-4'>
      <h3>Sizes</h3>
      {sizes.map((size) => (
        <button
          className={`${
            availableSizes.includes(size)
              ? 'text-black hover:underline'
              : 'text-slate-400 hover:cursor-default'
          } mx-4`}
          key={size}
          onClick={(e) => handleSizeClick(e)}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
