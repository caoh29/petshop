interface Props {
  total: number;
}

export default function Total({ total = 0 }: Readonly<Props>) {
  return (
    <div className='flex justify-between'>
      <h3 className='text-gray-700 font-medium'>Estimate Total</h3>
      <p className='font-bold'>{total ? `$${total.toFixed(2)}` : '-'}</p>
    </div>
  );
}
