'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Card, CardContent, CardFooter } from './ui/card';

import { capitalizeString } from '@/lib/utils';

interface Props {
  name: string;
  image?: string;
  price?: number;
  category?: string;
}

export default function ProductCard({ name, image }: Readonly<Props>) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className='flex flex-col p-2 w-full items-center gap-2'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card className='overflow-hidden'>
        <CardContent className='p-0'>
          <Image
            className={`aspect-square rounded-md object-cover ${
              hovered && 'scale-105'
            }`}
            src={image ?? ''}
            alt={`${name} image`}
            width={275}
            height={275}
          />
        </CardContent>
        <CardFooter>
          <h3 className={`font-bold text-xs sm:text-base text-white`}>
            {capitalizeString(name)}{' '}
            <span className={'text-white'}>&rarr;</span>
          </h3>
        </CardFooter>
      </Card>
    </button>
  );
}
