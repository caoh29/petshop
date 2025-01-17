'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { capitalizeString } from '@/lib/utils';

interface Props {
  name: string;
  image: string | null;
}

export default function PetCard({ name, image }: Readonly<Props>) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className='flex flex-col p-2 w-full'
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
            width={320}
            height={320}
          />
        </CardContent>
      </Card>
      <h3
        className={`font-bold text-xs sm:text-base ${
          hovered ? 'text-amber-500' : ''
        }`}
      >
        {capitalizeString(name)}{' '}
        <span className={hovered ? 'text-amber-500' : ''}>&rarr;</span>
      </h3>
    </button>
  );
}
