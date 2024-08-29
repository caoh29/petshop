interface Props {
  tax: number;
}

export default function Taxes({ tax = 0 }: Readonly<Props>) {
  return (
    <div className='container flex justify-between'>
      <h3>Taxes</h3>
      <p>{tax ? `$${tax}` : '-'}</p>
    </div>
  );
}
