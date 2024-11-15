interface Props {
  shipping: number;
}

export default function Shipping({ shipping = 0 }: Readonly<Props>) {
  return (
    <div className='flex justify-between'>
      <h3 className='text-gray-700 font-medium'>
        Estimate Delivery & Handling
      </h3>
      <p className='font-light'>
        {shipping ? `$${shipping.toFixed(2)}` : 'Free'}
      </p>
    </div>
  );
}
