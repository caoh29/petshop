'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Search } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

import { ChevronDown } from 'lucide-react';

const components: {
  title: string;
  href?: string;
  children?: {
    title: string;
    href: string;
    children?: { title: string; href: string }[];
  }[];
}[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Shop by Pet',
    children: [
      {
        title: 'Dogs',
        href: '/dogs',
        children: [
          {
            title: 'Raw Food',
            href: '/raw-food',
          },
          {
            title: 'Wet Food',
            href: '/wet-food',
          },
          {
            title: 'Dry Food',
            href: '/dry-food',
          },
          {
            title: 'Bowls',
            href: '/bowls',
          },
          {
            title: 'Daycare',
            href: '/daycare',
          },
          {
            title: 'Toys',
            href: '/toys',
          },
          {
            title: 'Leashes',
            href: '/leashes',
          },
          {
            title: 'Beds',
            href: '/beds',
          },
        ],
      },
      {
        title: 'Cats',
        href: '/cats',
        children: [
          {
            title: 'Raw Food',
            href: '/raw-food',
          },
          {
            title: 'Wet Food',
            href: '/wet-food',
          },
          {
            title: 'Dry Food',
            href: '/dry-food',
          },
          {
            title: 'Bowls',
            href: '/bowls',
          },
          {
            title: 'Daycare',
            href: '/daycare',
          },
          {
            title: 'Toys',
            href: '/toys',
          },
          {
            title: 'Leashes',
            href: '/leashes',
          },
          {
            title: 'Beds',
            href: '/beds',
          },
        ],
      },
      {
        title: 'Birds',
        href: '/birds',
        children: [
          {
            title: 'Food',
            href: '/food',
          },
          {
            title: 'Bowls',
            href: '/bowls',
          },
          {
            title: 'Daycare',
            href: '/daycare',
          },
          {
            title: 'Cages',
            href: '/cages',
          },
        ],
      },
      {
        title: 'Fishes',
        href: '/fishes',
        children: [
          {
            title: 'Food',
            href: '/food',
          },
          {
            title: 'Decoration',
            href: '/decoration',
          },
          {
            title: 'Daycare',
            href: '/daycare',
          },
          {
            title: 'Tanks',
            href: '/tanks',
          },
        ],
      },
    ],
  },
  {
    title: 'New Arrivals',
    href: '/new-arrivals',
  },
  {
    title: 'Rewards',
    href: '/rewards',
  },
  {
    title: 'Gift Cards',
    href: '/gift-cards',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
];

export function SideNavBar({ className }: Readonly<{ className?: string }>) {
  const [showCategoryList, setShowCategoryList] = useState<
    Record<string, boolean>
  >({});
  const [showSubcategoryList, setShowSubcategoryList] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = (category: string) => {
    setShowCategoryList({
      ...showCategoryList,
      [category]: !showCategoryList[category],
    });
  };

  const toggleSubcategory = (subcategory: string) => {
    setShowSubcategoryList({
      ...showSubcategoryList,
      [subcategory]: !showSubcategoryList[subcategory],
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className={`text-white text-xl mr-2 ${className}`}>☰</span>
      </SheetTrigger>
      <SheetContent side='left'>
        <ul className='flex flex-col flex-nowrap list-none text-black'>
          {components.map((component) => (
            <li key={component.title} className='mx-4'>
              {component.href && (
                <Link href={component.href}>{component.title}</Link>
              )}
              {component.children && (
                <>
                  <button
                    className='flex items-center'
                    onClick={() => toggleCategory(component.title)}
                  >
                    {component.title}
                    <ChevronDown
                      className='relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180'
                      aria-hidden='true'
                    />
                  </button>
                  {showCategoryList[component.title] && (
                    <ul className='flex flex-col list-none border-2 border-solid border-orange-400 bg-orange-400'>
                      {component.children.map((child) => (
                        <li key={child.title} className='my-1 mx-4'>
                          <button
                            className='flex items-center'
                            onClick={() => toggleSubcategory(child.title)}
                          >
                            {child.title}
                            <ChevronDown
                              className='relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180'
                              aria-hidden='true'
                            />
                          </button>
                          {showSubcategoryList[child.title] && (
                            <ul className='flex flex-col list-none bg-black'>
                              {child.children?.map((subchild) => (
                                <li
                                  key={subchild.title}
                                  className='my-2 mx-4 text-white'
                                >
                                  <Link href={`${child.href}${subchild.href}`}>
                                    {subchild.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
