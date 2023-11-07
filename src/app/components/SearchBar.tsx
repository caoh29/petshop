'use client';

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

export function SearchBar() {
  return (
    <div className='grid grid-cols-2 gap-2'>
      <Sheet>
        <SheetTrigger asChild>
          <Search color='white' className='hover:scale-110' />
        </SheetTrigger>
        <SheetContent side='top'>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='name' className='text-right'>
                Search
              </label>
              <input id='name' type='text' className='col-span-3' />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <button>Submit</button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
