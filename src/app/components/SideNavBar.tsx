'use client';
import { useState } from 'react';
import Link from 'next/link';

import { ChevronDown } from 'lucide-react';
import { ROUTES } from '@/routes';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet';
import AuthButton from './AuthButton';

interface Props {
  className?: string;
  isAdmin: boolean;
  userId: string | null;
}

export default function SideNavBar({
  className,
  isAdmin,
  userId,
}: Readonly<Props>) {
  const [showCategoryList, setShowCategoryList] = useState<
    Record<string, boolean>
  >({});
  const [showSubcategoryList, setShowSubcategoryList] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = (category: string) => {
    if (
      Object.keys(showCategoryList).length === 1 &&
      !showCategoryList[category]
    )
      return;

    if (showCategoryList[category]) {
      setShowCategoryList({});
      return;
    }

    setShowCategoryList({
      [category]: true,
    });
  };

  const toggleSubcategory = (subcategory: string) => {
    if (
      Object.keys(showSubcategoryList).length === 1 &&
      !showSubcategoryList[subcategory]
    )
      return;

    if (showSubcategoryList[subcategory]) {
      setShowSubcategoryList({});
      return;
    }

    setShowSubcategoryList({
      [subcategory]: true,
    });
  };

  const resetStates = () => {
    setShowCategoryList({});
    setShowSubcategoryList({});
  };

  const filterRoutes = () => {
    if (!userId) return ROUTES.filter((route) => !route.isProtected);
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
      <SheetContent
        side='left'
        onCloseAutoFocus={resetStates}
        className='bg-primary'
      >
        <ul className='flex flex-col flex-nowrap list-none text-white'>
          {filterRoutes().map((component) => (
            <li key={component.title} className='mx-4 my-1'>
              {component.href && (
                <Link onClick={resetStates} href={component.href}>
                  <SheetClose> {component.title}</SheetClose>
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
                    <ul className='flex flex-col list-none relative bg-secondary'>
                      {component.children.map((child) => {
                        if (!child.children)
                          return (
                            <li key={child.title} className='my-1 mx-4'>
                              <Link onClick={resetStates} href={child.href!}>
                                <SheetClose>{child.title}</SheetClose>
                              </Link>
                            </li>
                          );

                        return (
                          <li key={child.title} className='my-2 mx-4'>
                            <button
                              className='flex items-center pb-1'
                              onClick={() => toggleSubcategory(child.title)}
                            >
                              {child.title}
                              <ChevronDown
                                className='relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180'
                                aria-hidden='true'
                              />
                            </button>
                            {showSubcategoryList[child.title] && (
                              <ul className='flex flex-col list-non bg-ternary border-2 border-solid border-white'>
                                {child.children?.map((subchild) => (
                                  <li
                                    key={subchild.title}
                                    className='py-2 px-4 border-t-2 first-of-type:border-t-0 border-solid border-white'
                                  >
                                    <Link
                                      onClick={resetStates}
                                      href={`${child.href}${subchild.href}`}
                                    >
                                      <SheetClose>{subchild.title}</SheetClose>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
        <AuthButton userId={userId} className='ml-4 my-4 block sm:hidden' />
      </SheetContent>
    </Sheet>
  );
}
