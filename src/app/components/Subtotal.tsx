interface Props {
  subtotal: number;
}

export default function Subtotal({ subtotal = 0 }: Readonly<Props>) {
  return (
    <div className='flex justify-between '>
      <h3 className='text-gray-700 font-medium'>Subtotal</h3>
      <p className='font-light'>{subtotal ? `$${subtotal.toFixed(2)}` : '-'}</p>
    </div>
  );
}
