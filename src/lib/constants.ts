export const SORTING_OPTIONS = {
  product: [
    { label: 'Newest', value: 'createdAt_desc', adminOnly: false },
    { label: 'Price: Low to High', value: 'price_asc', adminOnly: false },
    { label: 'Price: High to Low', value: 'price_desc', adminOnly: false },
    { label: 'Name: A-Z', value: 'name_asc', adminOnly: false },
    { label: 'Name: Z-A', value: 'name_desc', adminOnly: false },
    { label: 'Stock: High to Low', value: 'stock_desc', adminOnly: true },
    { label: 'Stock: Low to High', value: 'stock_asc', adminOnly: true },
    { label: 'Discount: High to Low', value: 'discount_desc', adminOnly: true },
    { label: 'Discount: Low to High', value: 'discount_asc', adminOnly: true },
  ],
  order: [
    { label: 'Newest', value: 'createdAt_desc', adminOnly: false },
    { label: 'Oldest', value: 'createdAt_asc', adminOnly: false },
    { label: 'Total: High to Low', value: 'total_desc', adminOnly: false },
    { label: 'Total: Low to High', value: 'total_asc', adminOnly: false },
  ],
  user: [
    { label: 'Name: A-Z', value: 'firstName_asc', adminOnly: false },
    { label: 'Name: Z-A', value: 'firstName_desc', adminOnly: false },
    { label: 'Email: A-Z', value: 'email_asc', adminOnly: false },
    { label: 'Email: Z-A', value: 'email_desc', adminOnly: false },
    { label: 'Newest', value: 'createdAt_desc', adminOnly: false },
    { label: 'Oldest', value: 'createdAt_asc', adminOnly: false },
  ],
};