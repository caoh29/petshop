'use client';

import { useState, useEffect, useMemo } from 'react';

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';

import {
  SimplifiedOrder,
  SimplifiedProduct,
  SimplifiedUser,
} from '@/types/types';
import { SORTING_OPTIONS } from '@/lib/constants';

interface SortOption {
  label: string;
  value: string;
}

type ItemType = SimplifiedProduct | SimplifiedOrder | SimplifiedUser;

interface SortDropdownProps<T extends ItemType> {
  items: T[];
}

export default function SortDropdown<T extends ItemType>({
  items,
}: Readonly<SortDropdownProps<T>>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sortOptions: SortOption[] = useMemo(() => {
    if (items.length === 0) return [];

    const firstItem = items[0];

    if ('price' in firstItem) {
      // Product sorting options
      if (pathname === '/admin/products') return SORTING_OPTIONS.product;
      return SORTING_OPTIONS.product.filter((option) => !option.adminOnly);
    } else if ('total' in firstItem) {
      // Order sorting options
      return SORTING_OPTIONS.order;
    } else if ('email' in firstItem) {
      // User sorting options
      return SORTING_OPTIONS.user;
    }

    return [];
  }, [items, pathname]);

  const [selectedSort, setSelectedSort] = useState<SortOption>({
    label: 'Sort By',
    value: '',
  });

  const updateSort = (newSortBy: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('sort', newSortBy);
    router.replace(`?${newParams.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    const initialSortOption = sortOptions.find((option) => {
      if (searchParams.has('sort')) {
        return option.value === searchParams.get('sort');
      }
    }) ?? {
      label: 'Sort By',
      value: '',
    };
    setSelectedSort(initialSortOption);
  }, [searchParams, sortOptions]);

  const handleSortChange = (option: SortOption) => {
    setSelectedSort(option);
    updateSort(option.value);
  };

  if (sortOptions.length === 0) return; // No sorting options available

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='w-[150px] sm:w-[200px] justify-between'
        >
          {selectedSort.label ?? ''}
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
