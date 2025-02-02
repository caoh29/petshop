// 'use client';

// import { useAppDispatch } from '@/hooks';

// import { deleteProductFromCart } from '../../store/store';

// import { deleteProductCartAction } from '@/app/actions';

// interface Props {
//   id: string;
//   size?: string;
//   color?: string;
//   userId: string | null;
// }

// export default function CartDeleteSelector({
//   id,
//   size,
//   color,
//   userId,
// }: Readonly<Props>) {
//   const dispatch = useAppDispatch();

//   const handleDelete = async () => {
//     if (userId && userId.length > 0) {
//       // Update the cart on the server for authenticated users
//       await deleteProductCartAction(
//         id,
//         {
//           size: size ?? '',
//           color: color ?? '',
//         },
//         userId,
//       );
//     }

//     dispatch(
//       deleteProductFromCart({
//         productId: id,
//         size: size ?? '',
//         color: color ?? '',
//       }),
//     );
//   };

//   return (
//     <button className='text-red-500' onClick={() => handleDelete()}>
//       Remove
//     </button>
//   );
// }

'use client';

import { useAppDispatch } from '@/hooks';
import { deleteProductFromCart } from '../../store/store';
import { deleteProductCartAction } from '@/app/actions';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

interface Props {
  id: string;
  size?: string;
  color?: string;
  userId: string | null;
}

export default function CartDeleteSelector({
  id,
  size,
  color,
  userId,
}: Readonly<Props>) {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (userId && userId.length > 0) {
      await deleteProductCartAction(
        id,
        {
          size: size ?? '',
          color: color ?? '',
        },
        userId,
      );
    }

    dispatch(
      deleteProductFromCart({
        productId: id,
        size: size ?? '',
        color: color ?? '',
      }),
    );
  };

  return (
    <Button
      variant='ghost'
      size='sm'
      className='text-destructive hover:text-destructive hover:bg-destructive/10'
      onClick={() => handleDelete()}
    >
      <Trash2 className='w-4 h-4' />
    </Button>
  );
}
