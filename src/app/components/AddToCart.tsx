'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { Button } from './ui/button';

import { addProductToCart } from '../../store/store';

import { useAppDispatch } from '@/hooks';

import { Product, SelectedProduct } from '@/api/types';

interface Props {
  className?: string;
  userId: string | null;
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
}

export default function AddToCart({
  className,
  userId,
  addProductToCartAction,
  disabled,
  product,
  sizes,
  colors,
}: Readonly<Props>) {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const size = searchParams.get('Size') ?? '';
  const color = searchParams.get('Color') ?? '';
  const quantity = Number(searchParams.get('Quantity') ?? 1);

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

    if (userId) {
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
        productPrice: product.price - (product.price * product.discount) / 100,
        productCategory: product.category,
        productSubcategory: product.subcategory,
        size,
        color,
        quantity,
      };
    }

    dispatch(addProductToCart({ selectedProduct, userId }));

    updateSearchParams();
  };

  return (
    <Button
      className={`${className} mt-6 text-lg font-bold`}
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
