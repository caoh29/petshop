import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { ProductVariantsProps } from './types';

export function ProductVariants({
  form,
  isEditing,
  newSize,
  setNewSize,
  newColor,
  setNewColor,
  newAvailableSize,
  setNewAvailableSize,
  newAvailableColor,
  setNewAvailableColor,
}: Readonly<ProductVariantsProps>) {
  // Helper functions for managing sizes and colors
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
        <FormLabel className='text-white'>Sizes</FormLabel>
        <div className='flex flex-wrap gap-2 mt-2 mb-2'>
          {form.getValues().sizes?.map((size) => (
            <Badge key={size} variant='secondary' className='px-3 py-1'>
              {size}
              {isEditing && (
                <button
                  type='button'
                  className='ml-2 text-xs'
                  onClick={() => removeSize(size)}
                >
                  ✕
                </button>
              )}
            </Badge>
          ))}
        </div>
        {isEditing && (
          <div className='flex gap-4'>
            <Input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder='Add size'
              className='flex-1 text-black placeholder:text-gray-400'
            />
            <Button type='button' variant='secondary' onClick={addSize}>
              Add
            </Button>
          </div>
        )}
      </div>

      {/* Available Sizes section */}
      <div>
        <FormLabel className='text-white'>Available Sizes</FormLabel>
        <div className='flex flex-wrap gap-2 mt-2 mb-2'>
          {form.getValues().availableSizes?.map((size) => (
            <Badge key={size} variant='secondary' className='px-3 py-1'>
              {size}
              {isEditing && (
                <button
                  type='button'
                  className='ml-2 text-xs'
                  onClick={() => removeAvailableSize(size)}
                >
                  ✕
                </button>
              )}
            </Badge>
          ))}
        </div>
        {isEditing && (
          <div className='flex gap-4'>
            <Input
              value={newAvailableSize}
              onChange={(e) => setNewAvailableSize(e.target.value)}
              placeholder='Add available size'
              className='flex-1 text-black placeholder:text-gray-400'
            />
            <Button
              type='button'
              variant='secondary'
              onClick={addAvailableSize}
            >
              Add
            </Button>
          </div>
        )}
      </div>

      {/* Colors section */}
      <div>
        <FormLabel className='text-white'>Colors</FormLabel>
        <div className='flex flex-wrap gap-2 mt-2 mb-2'>
          {form.getValues().colors?.map((color) => (
            <Badge key={color} variant='secondary' className='px-3 py-1'>
              {color}
              {isEditing && (
                <button
                  type='button'
                  className='ml-2 text-xs'
                  onClick={() => removeColor(color)}
                >
                  ✕
                </button>
              )}
            </Badge>
          ))}
        </div>
        {isEditing && (
          <div className='flex gap-4'>
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder='Add color'
              className='flex-1 text-black placeholder:text-gray-400'
            />
            <Button type='button' variant='secondary' onClick={addColor}>
              Add
            </Button>
          </div>
        )}
      </div>

      {/* Available Colors section */}
      <div>
        <FormLabel className='text-white'>Available Colors</FormLabel>
        <div className='flex flex-wrap gap-2 mt-2 mb-2'>
          {form.getValues().availableColors?.map((color) => (
            <Badge key={color} variant='secondary' className='px-3 py-1'>
              {color}
              {isEditing && (
                <button
                  type='button'
                  className='ml-2 text-xs'
                  onClick={() => removeAvailableColor(color)}
                >
                  ✕
                </button>
              )}
            </Badge>
          ))}
        </div>
        {isEditing && (
          <div className='flex gap-4'>
            <Input
              value={newAvailableColor}
              onChange={(e) => setNewAvailableColor(e.target.value)}
              placeholder='Add available color'
              className='flex-1 text-black placeholder:text-gray-400'
            />
            <Button
              type='button'
              variant='secondary'
              onClick={addAvailableColor}
            >
              Add
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
