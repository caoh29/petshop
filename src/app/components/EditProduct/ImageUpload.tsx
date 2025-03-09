import Image from 'next/image';
import { Button } from '../ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { ImageUploadProps } from './types';

export function ImageUpload({
  form,
  isEditing,
  imagePreview,
  setImagePreview,
  additionalImagesPreview,
  setAdditionalImagesPreview,
}: Readonly<ImageUploadProps>) {
  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('image', result, {
          shouldDirty: true,
          shouldValidate: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle additional images preview
  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const readers = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results) => {
        setAdditionalImagesPreview(results);
        form.setValue('additionalImages', results, {
          shouldDirty: true,
          shouldValidate: true,
        });
      });
    }
  };

  if (!isEditing) return null;

  return (
    <div className='space-y-6'>
      <FormField
        control={form.control}
        name='image'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-white'>Primary Image</FormLabel>
            <div className='mt-2'>
              {imagePreview ? (
                <div className='relative h-40 w-40 mx-auto mb-4'>
                  <Image
                    src={imagePreview}
                    alt='Product preview'
                    fill
                    className='object-cover rounded-md'
                  />
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    className='absolute -top-2 -right-2'
                    onClick={() => {
                      setImagePreview(null);
                      field.onChange('');
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <div className='flex items-center justify-center w-full h-40 bg-primary-foreground/10 rounded-md'>
                  <p className='text-gray-400'>No image selected</p>
                </div>
              )}
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => {
                    handleImageChange(e);
                    field.onChange(e);
                  }}
                  className='mt-4 text-gray-400'
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='additionalImages'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-white'>Additional Images</FormLabel>
            <div className='mt-2'>
              {additionalImagesPreview.length > 0 ? (
                <div className='grid grid-cols-4 gap-4 mb-4'>
                  {additionalImagesPreview.map((img, index) => (
                    <div key={img + index} className='relative h-24 w-24'>
                      <Image
                        src={img}
                        alt={`Product preview ${index + 1}`}
                        fill
                        className='object-cover rounded-md'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='absolute -top-2 -right-2'
                        onClick={() => {
                          const newPreviews = additionalImagesPreview.filter(
                            (_, i) => i !== index,
                          );
                          setAdditionalImagesPreview(newPreviews);
                          field.onChange(newPreviews);
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex items-center justify-center w-full h-24 bg-primary-foreground/10 rounded-md mb-4'>
                  <p className='text-gray-400'>No additional images</p>
                </div>
              )}
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={(e) => {
                    handleAdditionalImagesChange(e);
                    field.onChange(e);
                  }}
                  className='text-gray-400'
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
