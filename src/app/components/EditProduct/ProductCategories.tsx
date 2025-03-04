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

// Cache for subcategories data
const cache: Record<
  string,
  Array<{ id: string; name: string; categoryId: string; image: string }>
> = {};

export function ProductCategories({
  form,
  isEditing,
  categories,
}: Readonly<ProductCategoriesProps>) {
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

  // Memorized fetch function with caching
  const fetchSubcategories = useCallback(async (categoryId: string) => {
    if (cache[categoryId]) {
      setSubcategories(cache[categoryId]);
      return;
    }

    try {
      setIsLoadingSubcategories(true);
      setError(null);
      const data = await getSubCategoriesAction(categoryId);
      cache[categoryId] = data;
      setSubcategories(data);
    } catch (err) {
      setError('Failed to load subcategories. Please try again.');
      setSubcategories([]);
    } finally {
      setIsLoadingSubcategories(false);
    }
  }, []);

  // Handle category change
  const handleCategoryChange = async (categoryId: string) => {
    await fetchSubcategories(categoryId);
    // Reset subcategory when category changes
    form.setValue('subcategory', '', {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // Initial data fetch
  useEffect(() => {
    const selectedCategory = form.getValues().category;
    if (selectedCategory) {
      const categoryId = categories.find(
        (cat) => cat.id === selectedCategory,
      )?.id;
      if (categoryId) {
        fetchSubcategories(categoryId);
      }
    }
  }, [fetchSubcategories, form, categories]);

  return (
    <>
      {error && (
        <div className='text-red-500 bg-red-50 p-4 rounded mb-4'>{error}</div>
      )}
      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Category</FormLabel>
              <FormControl>
                <Select
                  disabled={!isEditing}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCategoryChange(value);
                  }}
                  {...field}
                >
                  <SelectTrigger
                    className={
                      !isEditing
                        ? 'bg-primary-foreground/10 text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                        : 'text-black bg-white'
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {isEditing && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='subcategory'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Subcategory</FormLabel>
              <FormControl>
                <Select
                  disabled={
                    !isEditing ||
                    !form.getValues().category ||
                    isLoadingSubcategories
                  }
                  onValueChange={field.onChange}
                  {...field}
                >
                  <SelectTrigger
                    className={
                      !isEditing
                        ? 'bg-primary-foreground/10 text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                        : 'text-black bg-white'
                    }
                  >
                    {isLoadingSubcategories ? (
                      <Skeleton className='h-8 w-full' />
                    ) : (
                      <SelectValue />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {isEditing && <FormMessage />}
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
