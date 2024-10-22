'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { Button } from './ui/button';

import {
  RootState,
  addProductToCart,
  resetProductState,
} from '../../store/store';

import { useAppDispatch, useCart, useUserAuthentication } from '@/hooks';

import { SelectedProduct, type Cart } from '@/api/types';

export default function AddToCart({
  addToCartAction,
  disabled,
  productId,
  sizes,
  colors,
}: Readonly<{
  addToCartAction: (
    id: string,
    quantity: number,
    options: { size?: string; color?: string },
  ) => Promise<SelectedProduct>;
  disabled: boolean;
  productId: string;
  sizes?: string[];
  colors?: string[];
}>) {
  const dispatch = useAppDispatch();

  const isAuthenticated = useUserAuthentication();
  // const { quantity, size, color } = useSelector(
  //   (state: RootState) => state.selectedProduct.selectedProduct,
  // );

  const cart = useCart();

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const size = searchParams.get('Size') ?? '';
  const color = searchParams.get('Color') ?? '';
  const quantity = Number(searchParams.get('Quantity'));

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     const localCart = localStorage.getItem("cart");
  //     if (localCart) {
  //       dispatch(setCart(JSON.parse(localCart)));
  //     }
  //   }
  // }, [isAuthenticated, dispatch]);

  const updateSearchParams = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('Size');
    newParams.delete('Quantity');
    newParams.delete('Color');
    router.replace(`/${params.category}/${params.subcategory}/${params.id}`, {
      scroll: false,
    });
  };

  // This component needs to know if user is authenticated if so, send request to server, else get data from client's lcoal storage
  // const handleClick = async () => {
  //   if (disabled) return;
  //   dispatch(
  //     addProductToCart(
  //       await addToCartAction(productId, quantity, {
  //         size,
  //         color,
  //       }),
  //     ),
  //   );
  //   updateSearchParams();
  // };
  const handleClick = async () => {
    if (disabled) return;

    let selectedProduct: SelectedProduct;

    if (isAuthenticated) {
      selectedProduct = await addToCartAction(productId, quantity, {
        size,
        color,
      });
    } else {
      selectedProduct = {
        productId,
        productImage: '', // You might want to pass these as props
        productName: '', // You might want to pass these as props
        productPrice: 0, // You might want to pass these as props
        productCategory: '', // You might want to pass these as props
        productSubcategory: '', // You might want to pass these as props
        size,
        color,
        quantity,
      };
    }

    dispatch(addProductToCart(selectedProduct));

    if (!isAuthenticated) {
      localStorage.setItem(
        'cart',
        JSON.stringify({
          ...cart,
          products: [...cart.products, selectedProduct],
        }),
      );
    }

    updateSearchParams();
  };

  return (
    <Button
      className={`mt-6 text-lg font-bold`}
      onClick={() => handleClick()}
      disabled={
        disabled ||
        (!size && sizes && sizes.length > 0) ||
        (!color && colors && colors.length > 0)
      }
    >
      {disabled ? 'Unavailable' : 'Add to cart'}
    </Button>
  );
}
