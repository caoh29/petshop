'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { Button } from './ui/button';

import {
  RootState,
  addProductToCart,
  resetProductState,
} from '../../store/store';

import { useAppDispatch, useCart, useUserAuthentication } from '@/hooks';

import { Product, SelectedProduct, type Cart } from '@/api/types';

export default function AddToCart({
  addProductToCartAction,
  disabled,
  product,
  sizes,
  colors,
}: Readonly<{
  addProductToCartAction: (
    id: string,
    quantity: number,
    options: { size?: string; color?: string },
    userId?: string,
  ) => Promise<SelectedProduct>;
  disabled: boolean;
  product: Product;
  sizes?: string[];
  colors?: string[];
}>) {
  const { userId, isAuthenticated } = useUserAuthentication();
  const cart = useCart();
  const dispatch = useAppDispatch();
  // const { quantity, size, color } = useSelector(
  //   (state: RootState) => state.selectedProduct.selectedProduct,
  // );

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
  const handleClick = async () => {
    if (disabled) return;

    let selectedProduct: SelectedProduct;

    if (isAuthenticated) {
      selectedProduct = await addProductToCartAction(
        product.id,
        quantity,
        {
          size,
          color,
        },
        userId,
      );
    } else {
      selectedProduct = {
        productId: product.id,
        productImage: product.image,
        productName: product.name,
        productPrice: product.price,
        productCategory: product.category,
        productSubcategory: product.subcategory,
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
