'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  RootState,
} from '@/lib/store/store';

import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector() {
  const dispatch = useDispatch();
  const quantity = useSelector(
    (state: RootState) => state.selectedProduct.selectedProduct.quantity,
  );

  return (
    <div className='my-4'>
      <h3>Quantity</h3>
      <button onClick={() => dispatch(decreaseQuantity())}>
        <Minus />
      </button>
      <span className='mx-4'>{quantity}</span>
      <button onClick={() => dispatch(increaseQuantity())}>
        <Plus />
      </button>
    </div>
  );
}

// 'use client';

// import { useDispatch } from 'react-redux';
// import { Minus, Plus } from 'lucide-react';
// import { updateItemQuantity } from '@/lib/store/store';

// interface QuantitySelectorProps {
//   id: number;
//   quantity: number;
// }

// export default function QuantitySelector({
//   id,
//   quantity,
// }: Readonly<QuantitySelectorProps>) {
//   const dispatch = useDispatch();

//   const handleIncrease = () => {
//     dispatch(updateItemQuantity({ id, quantity: quantity + 1 }));
//   };

//   const handleDecrease = () => {
//     if (quantity > 1) {
//       dispatch(updateItemQuantity({ id, quantity: quantity - 1 }));
//     }
//   };

//   return (
//     <div className='my-4 flex items-center'>
//       <button onClick={handleDecrease} className='p-2 border rounded-l'>
//         <Minus className='w-4 h-4' />
//       </button>
//       <span className='mx-4 min-w-[2rem] text-center'>{quantity}</span>
//       <button onClick={handleIncrease} className='p-2 border rounded-r'>
//         <Plus className='w-4 h-4' />
//       </button>
//     </div>
//   );
// }
