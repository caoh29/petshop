'use client';
import { useState } from 'react';
import Link from 'next/link';

import { ChevronDown } from 'lucide-react';
import { ROUTES } from '@/api/routes';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet';
import { useUser } from '@/hooks';

export default function SideNavBar({
  className,
}: Readonly<{ className?: string }>) {
  const [showCategoryList, setShowCategoryList] = useState<
    Record<string, boolean>
  >({});
  const [showSubcategoryList, setShowSubcategoryList] = useState<
    Record<string, boolean>
  >({});

  const { isAdmin, isAuthenticated } = useUser();

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

  const resetStates = () => {
    setShowCategoryList({});
    setShowSubcategoryList({});
  };

  const filterRoutes = () => {
    if (!isAuthenticated) return ROUTES.filter((route) => !route.isProtected);
    if (isAdmin) return ROUTES;
    return ROUTES.filter((route) => route.href !== '/admin');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <span
          className={`text-white text-xl hover:cursor-pointer ${className}`}
        >
          ☰
        </span>
      </SheetTrigger>
      <SheetContent side='left' onCloseAutoFocus={resetStates}>
        <ul className='flex flex-col flex-nowrap list-none text-black'>
          {filterRoutes().map((component) => (
            <li key={component.title} className='mx-4'>
              {component.href && (
                <Link onClick={resetStates} href={component.href}>
                  {component.title}
                </Link>
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
                    <ul className='flex flex-col list-none absolute border-2 border-solid border-orange-400 bg-orange-400'>
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
                            <ul className='flex flex-row list-none bg-black'>
                              {child.children?.map((subchild) => (
                                <li key={subchild.title} className='my-2 mx-4'>
                                  <Link
                                    onClick={resetStates}
                                    href={`${child.href}${subchild.href}`}
                                  >
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
