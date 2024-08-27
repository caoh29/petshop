import CartList from '@/app/components/CartList';

export default function CartPage() {
  // const addToCartAction = async (
  //   quantity: number,
  //   options: {
  //     size?: string;
  //     color?: string;
  //   },
  // ) => {
  //   'use server';
  //   return await addToCart(+id, {
  //     quantity,
  //     options,
  //   });
  // };
  return (
    <>
      <CartList />
    </>
  );
}
