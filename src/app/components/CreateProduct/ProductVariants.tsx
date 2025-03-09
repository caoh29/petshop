import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FormLabel, FormDescription } from '../ui/form';
import { Input } from '../ui/input';
import { ProductVariantsProps } from './types';

/**
 * Component for handling product variants
 * Includes sizes, available sizes, colors, and available colors
 */
export function ProductVariants({
  form,
  newSize,
  setNewSize,
  newColor,
  setNewColor,
  newAvailableSize,
  setNewAvailableSize,
  newAvailableColor,
  setNewAvailableColor,
}: Readonly<ProductVariantsProps>) {
  /**
   * Add a new size to both sizes and available sizes
   */
  const addSize = () => {
    if (newSize && !form.getValues().sizes?.includes(newSize)) {
      const currentSizes = form.getValues().sizes || [];
      const currentAvailableSizes = form.getValues().availableSizes || [];

      // Add to sizes
      form.setValue('sizes', [...currentSizes, newSize], {
        shouldDirty: true,
        shouldValidate: true,
      });

      // Add to available sizes if not already present
      if (!currentAvailableSizes.includes(newSize)) {
        form.setValue('availableSizes', [...currentAvailableSizes, newSize], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      setNewSize('');
    }
  };

  /**
   * Remove a size from both sizes and available sizes
   */
  const removeSize = (size: string) => {
    const currentSizes = form.getValues().sizes || [];
    const currentAvailableSizes = form.getValues().availableSizes || [];

    // Remove from sizes
    form.setValue(
      'sizes',
      currentSizes.filter((s) => s !== size),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    // Remove from available sizes
    form.setValue(
      'availableSizes',
      currentAvailableSizes.filter((s) => s !== size),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  /**
   * Add a new available size
   */
  const addAvailableSize = () => {
    if (
      newAvailableSize &&
      !form.getValues().availableSizes?.includes(newAvailableSize)
    ) {
      const currentSizes = form.getValues().sizes || [];
      const currentAvailableSizes = form.getValues().availableSizes || [];

      // Add to available sizes
      form.setValue(
        'availableSizes',
        [...currentAvailableSizes, newAvailableSize],
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );

      // Add to sizes if not already present
      if (!currentSizes.includes(newAvailableSize)) {
        form.setValue('sizes', [...currentSizes, newAvailableSize], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      setNewAvailableSize('');
    }
  };

  /**
   * Remove an available size
   */
  const removeAvailableSize = (size: string) => {
    form.setValue(
      'availableSizes',
      form.getValues().availableSizes?.filter((s) => s !== size) || [],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  /**
   * Add a new color to both colors and available colors
   */
  const addColor = () => {
    if (newColor && !form.getValues().colors?.includes(newColor)) {
      const currentColors = form.getValues().colors || [];
      const currentAvailableColors = form.getValues().availableColors || [];

      // Add to colors
      form.setValue('colors', [...currentColors, newColor], {
        shouldDirty: true,
        shouldValidate: true,
      });

      // Add to available colors if not already present
      if (!currentAvailableColors.includes(newColor)) {
        form.setValue(
          'availableColors',
          [...currentAvailableColors, newColor],
          {
            shouldDirty: true,
            shouldValidate: true,
          },
        );
      }

      setNewColor('');
    }
  };

  /**
   * Remove a color from both colors and available colors
   */
  const removeColor = (color: string) => {
    const currentColors = form.getValues().colors || [];
    const currentAvailableColors = form.getValues().availableColors || [];

    // Remove from colors
    form.setValue(
      'colors',
      currentColors.filter((c) => c !== color),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    // Remove from available colors
    form.setValue(
      'availableColors',
      currentAvailableColors.filter((c) => c !== color),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  /**
   * Add a new available color
   */
  const addAvailableColor = () => {
    if (
      newAvailableColor &&
      !form.getValues().availableColors?.includes(newAvailableColor)
    ) {
      const currentColors = form.getValues().colors || [];
      const currentAvailableColors = form.getValues().availableColors || [];

      // Add to available colors
      form.setValue(
        'availableColors',
        [...currentAvailableColors, newAvailableColor],
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );

      // Add to colors if not already present
      if (!currentColors.includes(newAvailableColor)) {
        form.setValue('colors', [...currentColors, newAvailableColor], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      setNewAvailableColor('');
    }
  };

  /**
   * Remove an available color
   */
  const removeAvailableColor = (color: string) => {
    form.setValue(
      'availableColors',
      form.getValues().availableColors?.filter((c) => c !== color) || [],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  return (
    <>
      {/* Sizes section */}
      <div>
        <FormLabel className='text-ternary'>Sizes</FormLabel>
        <FormDescription className='text-white/50'>
          Add all possible sizes for this product
        </FormDescription>
        <div className='flex flex-wrap gap-2 mt-2 mb-2'>
          {form.watch('sizes')?.map((size) => (
            <Badge key={size} variant='secondary' className='px-3 py-1'>
              {size}
              <button
                type='button'
                className='ml-2 text-xs'
                onClick={() => removeSize(size)}
              >
                ✕
              </button>
            </Badge>
          ))}
        </div>
        <div className='flex gap-4'>
          <Input
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder='Add size (e.g., Small, Medium, Large)'
            className='flex-1 bg-primary-foreground/10 border-none text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
          />
          <Button type='button' onClick={addSize} variant='secondary'>
            Add
          </Button>
        </div>
      </div>

      {/* Available Sizes section */}
      <div className='mt-4'>
        <FormLabel className='text-ternary'>Available Sizes</FormLabel>
        <FormDescription className='text-white/50'>
          Sizes currently available for purchase
        </FormDescription>
        <div className='flex flex-wrap gap-2 mt-2 mb-2'>
          {form.watch('availableSizes')?.map((size) => (
            <Badge key={size} variant='secondary' className='px-3 py-1'>
              {size}
              <button
                type='button'
                className='ml-2 text-xs'
                onClick={() => removeAvailableSize(size)}
              >
                ✕
              </button>
            </Badge>
          ))}
        </div>
        <div className='flex gap-4'>
          <Input
            value={newAvailableSize}
            onChange={(e) => setNewAvailableSize(e.target.value)}
            placeholder='Add available size'
            className='flex-1 bg-primary-foreground/10 border-none text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
          />
          <Button type='button' onClick={addAvailableSize} variant='secondary'>
            Add
          </Button>
        </div>
      </div>

      {/* Colors section */}
      <div className='mt-4'>
        <FormLabel className='text-ternary'>Colors</FormLabel>
        <FormDescription className='text-white/50'>
          Add all possible colors for this product
        </FormDescription>
        <div className='flex flex-wrap gap-2 mt-2 mb-2'>
          {form.watch('colors')?.map((color) => (
            <Badge key={color} variant='secondary' className='px-3 py-1'>
              {color}
              <button
                type='button'
                className='ml-2 text-xs'
                onClick={() => removeColor(color)}
              >
                ✕
              </button>
            </Badge>
          ))}
        </div>
        <div className='flex gap-4'>
          <Input
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            placeholder='Add color (e.g., Red, Blue, Green)'
            className='flex-1 bg-primary-foreground/10 border-none text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
          />
          <Button type='button' onClick={addColor} variant='secondary'>
            Add
          </Button>
        </div>
      </div>

      {/* Available Colors section */}
      <div className='mt-4'>
        <FormLabel className='text-ternary'>Available Colors</FormLabel>
        <FormDescription className='text-white/50'>
          Colors currently available for purchase
        </FormDescription>
        <div className='flex flex-wrap gap-2 mt-2 mb-2'>
          {form.watch('availableColors')?.map((color) => (
            <Badge key={color} variant='secondary' className='px-3 py-1'>
              {color}
              <button
                type='button'
                className='ml-2 text-xs'
                onClick={() => removeAvailableColor(color)}
              >
                ✕
              </button>
            </Badge>
          ))}
        </div>
        <div className='flex gap-4'>
          <Input
            value={newAvailableColor}
            onChange={(e) => setNewAvailableColor(e.target.value)}
            placeholder='Add available color'
            className='flex-1 bg-primary-foreground/10 border-none text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
          />
          <Button type='button' onClick={addAvailableColor} variant='secondary'>
            Add
          </Button>
        </div>
      </div>
    </>
  );
}
