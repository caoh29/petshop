'use client';

import { useState, useEffect } from 'react';

import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

interface SortOption {
  label: string;
  value: string;
}

const sortOptions: SortOption[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export function SortDropdown() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  const updateSort = (newSortBy: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('sort', newSortBy);
    router.push(`/${params.category}?${newParams.toString()}`);
  };

  useEffect(() => {
    const initialSortOption =
      sortOptions.find((option) => {
        if (searchParams.has('sort')) {
          return option.value === searchParams.get('sort');
        }
        return option.value === 'featured';
      }) || sortOptions[0];
    setSelectedSort(initialSortOption);
  }, [searchParams]);

  const handleSortChange = (option: SortOption) => {
    setSelectedSort(option);
    updateSort(option.value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='w-[200px] justify-between'>
          {selectedSort.label}
          <ChevronDown className='ml-2 h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[200px]'>
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => handleSortChange(option)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
