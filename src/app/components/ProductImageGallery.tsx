'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  images: string[];
  productName: string;
  productImage: string;
  className?: string;
}

export default function ProductImageGallery({
  images,
  productName,
  productImage,
  className,
}: Readonly<Props>) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div className={`${className ?? ''} w-full max-w-2xl relative p-4 mx-auto`}>
      {images.length > 0 && (
        <>
          <div className='hidden sm:block w-1/5 absolute left-0 top-0 p-4 h-full overflow-y-auto'>
            {images.map((img, index) => (
              <Image
                key={img}
                src={img}
                alt={`${productName} thumbnail ${index + 1}`}
                width={100}
                height={100}
                className={`aspect-square object-cover mb-2 cursor-pointer ${
                  index === currentImageIndex ? 'border-2 border-primary' : ''
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
          <div className='sm:ml-[20%] relative'>
            <Image
              className='aspect-square rounded-md object-cover'
              src={images[currentImageIndex]}
              alt={`${productName} image`}
              width={1024}
              height={1024}
            />
            <div className='absolute bottom-4 right-4 flex gap-2'>
              <button
                onClick={handlePrevImage}
                className='bg-white rounded-full p-2 shadow-md'
                aria-label='Previous image'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={handleNextImage}
                className='bg-white rounded-full p-2 shadow-md'
                aria-label='Next image'
              >
                <ChevronRight className='w-6 h-6' />
              </button>
            </div>
          </div>
        </>
      )}
      {!images.length && (
        <Image
          className='aspect-square rounded-md object-cover'
          src={productImage}
          alt={`${productName} image`}
          width={1024}
          height={1024}
        />
      )}
    </div>
  );
}
