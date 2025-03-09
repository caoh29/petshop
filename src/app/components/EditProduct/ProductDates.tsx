import { ProductDatesProps } from './types';

export function ProductDates({
  createdAt,
  updatedAt,
  isEditing,
}: Readonly<ProductDatesProps>) {
  if (isEditing) return null;

  return (
    <div className='grid grid-cols-2 gap-4'>
      <div>
        <p className='text-sm font-medium text-accent'>Created At</p>
        <p>
          {new Date(createdAt).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      {updatedAt && (
        <div>
          <p className='text-sm font-medium text-accent'>Updated At</p>
          <p>
            {new Date(updatedAt).toLocaleDateString('en-CA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      )}
    </div>
  );
}
