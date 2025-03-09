import { useCallback, useEffect, useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { ProductCategoriesProps } from './types';
import { getSubCategoriesAction } from '@/app/api/actions/subcategories';

/**
 * Cache for subcategories data to prevent redundant API calls
 */
const cache: Record<
  string,
  Array<{ id: string; name: string; categoryId: string; image: string }>
> = {};

/**
 * Component for handling category and subcategory selection
 * Fetches subcategories dynamically based on selected category
 */
export function ProductCategories({
  form,
  categories,
}: Readonly<ProductCategoriesProps>) {
  // State for subcategories data and loading state
  const [subcategories, setSubcategories] = useState<
    Array<{
      id: string;
      name: string;
      categoryId: string;
      image: string;
    }>
  >([]);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch subcategories for a given category ID
   * Uses caching to prevent redundant API calls
   */
  const fetchSubcategories = useCallback(async (categoryId: string) => {
    // Return cached data if available
    if (cache[categoryId]) {
      setSubcategories(cache[categoryId]);
      return;
    }

    try {
      setIsLoadingSubcategories(true);
      setError(null);
      const data = await getSubCategoriesAction(categoryId);
      // Cache the result for future use
      cache[categoryId] = data;
      setSubcategories(data);
    } catch (err) {
      setError('Failed to load subcategories. Please try again.');
      setSubcategories([]);
    } finally {
      setIsLoadingSubcategories(false);
    }
  }, []);

  /**
   * Handle category change
   * Fetches subcategories and resets the subcategory selection
   */
  const handleCategoryChange = async (categoryId: string) => {
    await fetchSubcategories(categoryId);
    // Reset subcategory when category changes
    form.setValue('subcategory', '', {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  /**
   * Initial data fetch when component mounts
   * Loads subcategories if a category is already selected
   */
  useEffect(() => {
    const selectedCategory = form.getValues().category;
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    }
  }, [fetchSubcategories, form]);

  return (
    <>
      {/* Display error message if subcategory fetch fails */}
      {error && (
        <div className='text-red-500 bg-red-50 p-4 rounded mb-4'>{error}</div>
      )}

      <div className='grid grid-cols-2 gap-4'>
        {/* Category selection */}
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-ternary'>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCategoryChange(value);
                  }}
                  value={field.value}
                >
                  <SelectTrigger className='bg-primary-foreground/10 border-none text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        className='text-black focus:bg-secondary focus:text-white'
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subcategory selection */}
        <FormField
          control={form.control}
          name='subcategory'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-ternary'>Subcategory</FormLabel>
              <FormControl>
                <Select
                  disabled={
                    !form.getValues().category || isLoadingSubcategories
                  }
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className='bg-primary-foreground/10 border-none text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'>
                    {isLoadingSubcategories ? (
                      <Skeleton className='h-8 w-full' />
                    ) : (
                      <SelectValue placeholder='Select a subcategory' />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem
                        key={subcategory.id}
                        value={subcategory.id}
                        className='text-black focus:bg-secondary focus:text-white'
                      >
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
