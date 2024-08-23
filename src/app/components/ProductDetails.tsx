// 'use client'

// import { useState } from 'react';
// import AverageRating from '@/app/components/AverageRating';
// import QuantitySelector from '@/app/components/QuantitySelector';
// import SizeSelector from '@/app/components/SizeSelector';
// import ColorSelector from '@/app/components/ColorSelector';
// import AddToCart from '@/app/components/AddToCart';
// import { capitalizeString } from '@/lib/utils';

// interface ProductDetailsProps {
//   product: {
//     name: string;
//     category: string;
//     subcategory: string;
//     reviews: any[]; // Replace with proper review type
//     price: number;
//     sizes?: string[];
//     availableSizes?: string[];
//     colors?: string[];
//     availableColors?: string[];
//     description: string;
//     isOutOfStock: boolean;
//   };
//   addToCartAction: (quantity: number, options: { size?: string; color?: string }) => Promise<void>;
// }

// export default function ProductDetails({ product, addToCartAction }: ProductDetailsProps) {
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [quantity, setQuantity] = useState(1);

//   const handleAddToCart = async () => {
//     await addToCartAction(quantity, {
//       size: selectedSize || undefined,
//       color: selectedColor || undefined,
//     });
//   };

//   return (
//     <div className='w-full md:w-1/2 p-5'>
//       <h1 className='text-3xl font-bold leading-10 text-black'>
//         {product.name}
//       </h1>
//       <h3 className='text-md leading-5 text-gray-300'>
//         {capitalizeString(product.category)} -{' '}
//         {capitalizeString(product.subcategory)}
//       </h3>
//       <AverageRating reviews={product.reviews} />
//       <div className='my-1 text-md leading-5 text-gray-300'>
//         {product.price.toLocaleString('en-US', {
//           style: 'currency',
//           currency: 'USD',
//         })}
//       </div>
//       <SizeSelector
//         sizes={product.sizes ?? []}
//         availableSizes={product.availableSizes ?? []}
//         selectedSize={selectedSize}
//         onSelectSize={setSelectedSize}
//       />
//       <ColorSelector
//         colors={product.colors ?? []}
//         availableColors={product.availableColors ?? []}
//         selectedColor={selectedColor}
//         onSelectColor={setSelectedColor}
//       />
//       <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
//       <div className='mt-1 text-sm leading-5 text-gray-300 font-light italic'>
//         {product.description}
//       </div>

//       <div className='flex justify-end mt-4'>
//         <AddToCart
//           addToCartAction={handleAddToCart}
//           disabled={product.isOutOfStock}
//           product={product}
//         />
//       </div>
//     </div>
//   );
// }
