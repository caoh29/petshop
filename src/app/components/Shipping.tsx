interface Props {
  shipping: number;
  variant?: boolean;
}

export default function Shipping({
  shipping = 0,
  variant = false,
}: Readonly<Props>) {
  return (
    <div className='flex justify-between'>
      <h5 className={variant ? 'font-normal' : 'font-medium'}>
        {variant ? 'Delivery' : 'Estimate Delivery & Handling'}
      </h5>
      <p className={variant ? 'font-medium' : 'font-light'}>
        {shipping ? `$${shipping.toFixed(2)}` : 'Free'}
      </p>
    </div>
  );
}
