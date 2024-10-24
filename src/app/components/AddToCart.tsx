'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { Button } from './ui/button';

import { addProductToCart } from '../../store/store';

import { useAppDispatch, useUserAuthentication } from '@/hooks';

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
  const dispatch = useAppDispatch();
  const { userId, isAuthenticated } = useUserAuthentication();

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const size = searchParams.get('Size') ?? '';
  const color = searchParams.get('Color') ?? '';
  const quantity = Number(searchParams.get('Quantity'));

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
