interface Props {
  total: number;
}

export default function Total({ total = 0 }: Readonly<Props>) {
  return (
    <div className='container flex justify-between'>
      <h3>Total</h3>
      <p>{total ? `$${total}` : '-'}</p>
    </div>
  );
}
