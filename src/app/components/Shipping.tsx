interface Props {
  shipping: number;
}

export default function Shipping({ shipping = 0 }: Readonly<Props>) {
  return (
    <div className='container flex justify-between'>
      <h3>Estimate Delivery & Handling</h3>
      <p>{shipping ? `$${shipping}` : 'Free'}</p>
    </div>
  );
}
