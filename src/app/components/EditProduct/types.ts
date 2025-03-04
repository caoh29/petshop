import { Product } from '@/types/types';
import { UseFormReturn } from 'react-hook-form';
import { SchemaEditProduct } from '@/lib/schemas/edit-product';

export interface EditProductProps {
  product: Product;
  categories: { id: string; name: string }[];
}

export interface SharedFormProps {
  form: UseFormReturn<SchemaEditProduct>;
  isEditing: boolean;
}

export interface ProductCategoriesProps extends SharedFormProps {
  categories: { id: string; name: string }[];
}

export interface ImageUploadProps extends SharedFormProps {
  imagePreview: string | null;
  setImagePreview: (value: string | null) => void;
  additionalImagesPreview: string[];
  setAdditionalImagesPreview: (value: string[]) => void;
}

export interface ProductVariantsProps extends SharedFormProps {
  newSize: string;
  setNewSize: (value: string) => void;
  newColor: string;
  setNewColor: (value: string) => void;
  newAvailableSize: string;
  setNewAvailableSize: (value: string) => void;
  newAvailableColor: string;
  setNewAvailableColor: (value: string) => void;
}

export interface ProductDatesProps {
  createdAt: Date | string;
  updatedAt?: Date | string;
  isEditing: boolean;
} 