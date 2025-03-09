import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Trash2, Plus } from 'lucide-react';
import Image from 'next/image';
import { ImageUploadProps } from './types';

/**
 * Component for handling product image uploads
 * Includes primary image and additional images
 */
export function ImageUpload({
  form,
  imagePreview,
  setImagePreview,
  additionalImagesPreview,
  setAdditionalImagesPreview,
}: Readonly<ImageUploadProps>) {
  /**
   * Handle primary image upload
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);

      // Update form value
      form.setValue('image', result, {
        shouldDirty: true,
        shouldValidate: true,
      });
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handle additional images upload
   */
  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const newImages = [...additionalImagesPreview, result];
        setAdditionalImagesPreview(newImages);

        // Update form value
        form.setValue('additionalImages', newImages, {
          shouldDirty: true,
          shouldValidate: true,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  /**
   * Remove primary image
   */
  const removePrimaryImage = () => {
    setImagePreview(null);

    // Update form value
    form.setValue('image', '', {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  /**
   * Remove additional image at specified index
   */
  const removeAdditionalImage = (index: number) => {
    const newImages = additionalImagesPreview.filter((_, i) => i !== index);
    setAdditionalImagesPreview(newImages);

    // Update form value
    form.setValue('additionalImages', newImages, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      {/* Primary Image Upload */}
      <FormField
        control={form.control}
        name='image'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-ternary'>Product Image</FormLabel>
            <FormDescription className='text-white/50'>
              Upload the main product image
            </FormDescription>
            <div className='mt-2 flex flex-col items-center justify-center gap-4'>
              {imagePreview ? (
                <div className='relative h-40 w-40'>
                  <Image
                    src={imagePreview}
                    alt='Product preview'
                    fill
                    className='rounded-md object-cover'
                  />
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute -right-2 -top-2'
                    onClick={removePrimaryImage}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ) : (
                <div className='flex h-40 w-40 items-center justify-center rounded-md border border-dashed border-white/30'>
                  <p className='text-sm text-white/50'>No image selected</p>
                </div>
              )}
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='w-full max-w-xs bg-primary-foreground/10 border-none text-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                  value={field.value ? undefined : ''}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Additional Images Upload */}
      <FormField
        control={form.control}
        name='additionalImages'
        render={({ field }) => (
          <FormItem className='mt-6'>
            <FormLabel className='text-ternary'>Additional Images</FormLabel>
            <FormDescription className='text-white/50'>
              Upload additional product images (optional)
            </FormDescription>
            <div className='mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3'>
              {additionalImagesPreview.map((preview, index) => (
                <div key={index} className='relative h-24 w-full'>
                  <Image
                    src={preview}
                    alt={`Preview ${index}`}
                    fill
                    className='rounded-md object-cover'
                  />
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute -right-2 -top-2 h-6 w-6'
                    onClick={() => removeAdditionalImage(index)}
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </div>
              ))}
              <div className='flex h-24 w-full items-center justify-center rounded-md border border-dashed border-white/30'>
                <label
                  htmlFor='additional-images'
                  className='flex cursor-pointer flex-col items-center justify-center'
                >
                  <Plus className='h-6 w-6 text-white/50' />
                  <span className='mt-1 text-xs text-white/50'>Add Image</span>
                  <FormControl>
                    <Input
                      id='additional-images'
                      type='file'
                      accept='image/*'
                      onChange={handleAdditionalImagesChange}
                      className='hidden'
                      value={field.value ? undefined : ''}
                    />
                  </FormControl>
                </label>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
