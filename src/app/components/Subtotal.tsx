interface Props {
  subtotal: number;
  variant?: boolean;
}

export default function Subtotal({
  subtotal = 0,
  variant = false,
}: Readonly<Props>) {
  return (
    <div className='flex justify-between'>
      <h5 className={variant ? 'font-normal' : 'font-medium'}>Subtotal</h5>
      <p className={variant ? 'font-medium' : 'font-light'}>
        {subtotal ? `$${subtotal.toFixed(2)}` : '-'}
      </p>
    </div>
  );
}
