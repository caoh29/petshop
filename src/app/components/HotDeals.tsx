'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CarouselSection from '../components/CarouselSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const deals = [
  {
    id: '1',
    title: 'Premium Pet Food',
    discount: '30% OFF',
    image: '/placeholder.svg?height=400&width=600',
    originalPrice: 49.99,
    discountedPrice: 34.99,
  },
  {
    id: '2',
    title: 'Luxury Pet Beds',
    discount: '25% OFF',
    image: '/placeholder.svg?height=400&width=600',
    originalPrice: 89.99,
    discountedPrice: 67.49,
  },
  {
    id: '3',
    title: 'Pet Accessories Bundle',
    discount: '40% OFF',
    image: '/placeholder.svg?height=400&width=600',
    originalPrice: 129.99,
    discountedPrice: 77.99,
  },
];

export function HotDeals() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % deals.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + deals.length) % deals.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className='py-12 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-8'>Hot Deals</h2>
        <div className='relative'>
          <div className='overflow-hidden'>
            <div
              className='flex transition-transform duration-500 ease-in-out'
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {deals.map((deal) => (
                <div key={deal.id} className='w-full flex-shrink-0'>
                  <Card className='mx-auto max-w-4xl'>
                    <CardContent className='p-0'>
                      <div className='grid md:grid-cols-2 gap-4'>
                        <div className='relative h-64 md:h-96'>
                          <Image
                            src={deal.image || '/placeholder.svg'}
                            alt={deal.title}
                            fill
                            className='object-cover'
                          />
                          <div className='absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full'>
                            {deal.discount}
                          </div>
                        </div>
                        <div className='p-6 flex flex-col justify-center'>
                          <h3 className='text-2xl font-bold mb-4'>
                            {deal.title}
                          </h3>
                          <div className='space-y-2'>
                            <p className='text-gray-500 line-through'>
                              ${deal.originalPrice}
                            </p>
                            <p className='text-3xl font-bold text-primary'>
                              ${deal.discountedPrice}
                            </p>
                          </div>
                          <Button className='mt-6'>Shop Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant='outline'
            size='icon'
            className='absolute left-4 top-1/2 -translate-y-1/2 bg-white'
            onClick={prevSlide}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='absolute right-4 top-1/2 -translate-y-1/2 bg-white'
            onClick={nextSlide}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </section>
  );
}
