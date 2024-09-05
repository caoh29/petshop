'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroup {
  name: string;
  options: FilterOption[];
}

const filterGroups: FilterGroup[] = [
  {
    name: 'Type',
    options: [
      { id: 'type_1', label: 'Type 1' },
      { id: 'type_2', label: 'Type 2' },
      { id: 'type_3', label: 'Type 3' },
    ],
  },
  {
    name: 'Size',
    options: [
      { id: 'small', label: 'Small' },
      { id: 'medium', label: 'Medium' },
      { id: 'large', label: 'Large' },
    ],
  },
];

export function ProductFilters() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const updateFilters = (newFilters: Record<string, string[]>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Remove all existing filter params
    filterGroups.forEach((group) => {
      newParams.delete(group.name);
    });

    // Add new filter params
    Object.entries(newFilters).forEach(([key, values]) => {
      values.forEach((value) => newParams.append(key, value));
    });

    router.push(`/${params.category}?${newParams.toString()}`);
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const handleFilterChange = (groupName: string, optionId: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      const currentFilters = newFilters[groupName] || [];

      if (currentFilters.includes(optionId)) {
        // Remove the optionId if it's already selected
        newFilters[groupName] = currentFilters.filter((id) => id !== optionId);
      } else {
        // Add the optionId if it's not already selected
        newFilters[groupName] = [...currentFilters, optionId];
      }

      if (newFilters[groupName].length === 0) {
        delete newFilters[groupName];
      }

      updateFilters(newFilters);
      return newFilters;
    });
  };

  useEffect(() => {
    const initialSelectedFilters: Record<string, string[]> = {};
    filterGroups.forEach((group) => {
      const groupFilters = searchParams.getAll(group.name);
      if (groupFilters.length > 0) {
        initialSelectedFilters[group.name] = groupFilters;
      }
    });
    setSelectedFilters(initialSelectedFilters);
  }, [searchParams]);

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Filters</h3>
      {filterGroups.map((group) => (
        <div key={group.name} className='border-b pb-2'>
          <Button
            variant='ghost'
            className='w-full justify-between'
            onClick={() => toggleGroup(group.name)}
          >
            {group.name}
            {expandedGroups[group.name] ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </Button>
          {expandedGroups[group.name] && (
            <div className='mt-2 space-y-2'>
              {group.options.map((option) => (
                <div key={option.id} className='flex items-center space-x-2'>
                  <Checkbox
                    id={option.id}
                    checked={
                      selectedFilters[group.name]?.includes(option.id) || false
                    }
                    onCheckedChange={() =>
                      handleFilterChange(group.name, option.id)
                    }
                  />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}