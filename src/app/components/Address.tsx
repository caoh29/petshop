import { SelectContent } from '@radix-ui/react-select';
import { Input } from './ui/input';
// import {
//   Select,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectScrollDownButton,
//   SelectScrollUpButton,
//   SelectTrigger,
//   SelectValue,
// } from './ui/select';
import { COUNTRIES } from '@/api/countries';
import { capitalizeString } from '@/lib/utils';

interface Props {
  title?: string;
}

export default function Address({ title }: Readonly<Props>) {
  return (
    <div className='flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0'>
      <div className='w-full  xl:w-[1000px] flex flex-col justify-center text-left'>
        {title && <h1>{capitalizeString(title)}</h1>}

        <div className='grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2'>
          <div className='flex flex-col mb-2'>
            <span>First Name</span>
            <Input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2'>
            <span>Last Name</span>
            <Input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2'>
            <span>Address 1</span>
            <Input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2'>
            <span>Address 2 (optional)</span>
            <Input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2'>
            <span>Postal Code</span>
            <Input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2'>
            <span>City</span>
            <Input type='text' className='p-2 border rounded-md bg-gray-200' />
          </div>

          <div className='flex flex-col mb-2'>
            <span>Country</span>
            {/* <Select>
              <SelectTrigger className='p-2 border rounded-md bg-gray-200'>
                <SelectValue placeholder='Country' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Countries</SelectLabel>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Other</SelectLabel>
                  <SelectItem value='other'>Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select> */}
            <select className='p-2 border rounded-md bg-gray-200'>
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col mb-2'>
            <span>Phone</span>
            <Input type='tel' className='p-2 border rounded-md bg-gray-200' />
          </div>
        </div>
      </div>
    </div>
  );
}
