interface Props {
  children: React.ReactNode;
}

export default function CheckoutLayout({ children }: Readonly<Props>) {
  return <div className='px-4 py-8 sm:px-8'>{children}</div>;
}
