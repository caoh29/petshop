interface Props {
  subtotal: number;
}

export default function Subtotal({ subtotal = 0 }: Readonly<Props>) {
  return (
    <div className='container flex justify-between'>
      <h3>Subtotal</h3>
      <p>{subtotal ? `$${subtotal}` : '-'}</p>
    </div>
  );
}
