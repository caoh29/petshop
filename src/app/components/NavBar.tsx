'use client';

import Link from 'next/link';
import { useState } from 'react';

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

export default function NavBar() {
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
    <ul className='flex flex-col list-none md:flex-row'>
      {components.map((component) => (
        <li key={component.title} className='mr-4'>
          {component.href && (
            <Link href={component.href}>{component.title}</Link>
          )}
          {component.children && (
            <>
              <span
                className='block cursor-pointer'
                onClick={() => toggleCategory(component.title)}
              >
                {component.title}
              </span>
              {showCategoryList[component.title] && (
                <ul className='flex flex-col list-none'>
                  {component.children.map((child) => (
                    <li key={child.title} className='mr-4'>
                      <span
                        className='block cursor-pointer'
                        onClick={() => toggleSubcategory(child.title)}
                      >
                        {child.title}
                      </span>
                      {showSubcategoryList[child.title] && (
                        <ul className='flex flex-col list-none md:flex-row'>
                          {child.children?.map((subchild) => (
                            <li key={subchild.title} className='mr-4'>
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
  );
}
