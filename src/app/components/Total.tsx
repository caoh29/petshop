interface Props {
  total: number;
  variant?: boolean;
}

export default function Total({ total = 0, variant = false }: Readonly<Props>) {
  return (
    <div className='flex justify-between'>
      <h3 className={variant ? 'text-lg font-semibold' : 'font-medium'}>
        {variant ? 'Total' : 'Estimate Total'}
      </h3>
      <p className={variant ? 'text-lg font-semibold' : 'font-bold'}>
        {total ? `$${total.toFixed(2)}` : '-'}
      </p>
    </div>
  );
}
