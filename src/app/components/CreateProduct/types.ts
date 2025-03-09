import { UseFormReturn } from 'react-hook-form';
import { SchemaCreateProduct } from '@/lib/schemas/create-product';

/**
 * Props for the main CreateProduct component
 */
export interface CreateProductProps {
  categories: { id: string; name: string }[];
}

/**
 * Shared props for all form-related components
 */
export interface SharedFormProps {
  form: UseFormReturn<SchemaCreateProduct>;
}

/**
 * Props for the ProductCategories component
 */
export interface ProductCategoriesProps extends SharedFormProps {
  categories: { id: string; name: string }[];
}

/**
 * Props for the ImageUpload component
 */
export interface ImageUploadProps extends SharedFormProps {
  imagePreview: string | null;
  setImagePreview: (value: string | null) => void;
  additionalImagesPreview: string[];
  setAdditionalImagesPreview: (value: string[]) => void;
}

/**
 * Props for the ProductVariants component
 */
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

/**
 * Props for the ProductInventory component
 */
export interface ProductInventoryProps extends SharedFormProps {
  // No additional props needed
}

/**
 * Props for the ProductDetails component
 */
export interface ProductDetailsProps extends SharedFormProps {
  // No additional props needed
} 