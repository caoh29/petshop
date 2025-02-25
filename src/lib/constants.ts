export const SORTING_OPTIONS = {
  product: [
    { label: 'Newest', value: 'createdAt_desc' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Name: A-Z', value: 'name_asc' },
    { label: 'Name: Z-A', value: 'name_desc' },
  ],
  order: [
    { label: 'Newest', value: 'createdAt_desc' },
    { label: 'Oldest', value: 'createdAt_asc' },
    { label: 'Total: High to Low', value: 'total_desc' },
    { label: 'Total: Low to High', value: 'total_asc' },
  ],
  user: [
    { label: 'Name: A-Z', value: 'firstName_asc' },
    { label: 'Name: Z-A', value: 'firstName_desc' },
    { label: 'Email: A-Z', value: 'email_asc' },
    { label: 'Email: Z-A', value: 'email_desc' },
    { label: 'Newest', value: 'createdAt_desc' },
    { label: 'Oldest', value: 'createdAt_asc' },
  ],
};