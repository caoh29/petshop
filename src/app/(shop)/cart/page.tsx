import CartList from '@/app/components/CartList';
import CartSummary from '@/app/components/CartSummary';
import CheckoutButton from '@/app/components/CheckoutButton';

export default function CartPage() {
  return (
    <div className='flex flex-col md:flex-row gap-2 p-8'>
      <div className='container'>
        <h1 className='text-2xl font-bold mb-4'>Bag</h1>
        <CartList />
      </div>
      <div className='container flex flex-col flex-nowrap gap-2'>
        <h1 className='text-2xl font-bold'>Summary</h1>
        <CartSummary />
        <CheckoutButton />
      </div>
    </div>
  );
}
