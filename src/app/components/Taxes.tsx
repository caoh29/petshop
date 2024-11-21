interface Props {
  tax: number;
}

export default function Taxes({ tax = 0 }: Readonly<Props>) {
  return (
    <div className='flex justify-between'>
      <h5 className='font-normal'>Tax</h5>
      <p className='font-medium'>{tax ? `$${tax.toFixed(2)}` : '-'}</p>
    </div>
  );
}
