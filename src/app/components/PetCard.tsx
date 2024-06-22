'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';

const PetCard = ({ name, image }: { name?: string; image?: string | null }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className='flex flex-col p-2 w-[320px]'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card className='overflow-hidden'>
        <CardContent className='p-0'>
          <Image
            className={`aspect-[2/2] rounded-md object-cover ${
              hovered && 'scale-105'
            }`}
            src={image ?? ''}
            alt={`${name} image`}
            width={1024}
            height={1024}
          />
        </CardContent>
      </Card>
      <h3 className={`font-bold ${hovered ? 'text-red-500' : ''}`}>
        {name} <span className={hovered ? 'text-red-500' : ''}>&rarr;</span>
      </h3>
    </button>
  );
};

export default PetCard;
