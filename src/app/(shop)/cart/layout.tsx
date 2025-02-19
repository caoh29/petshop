interface Props {
  children: React.ReactNode;
}

export default function CartLayout({ children }: Readonly<Props>) {
  return <div className='px-4 py-8 sm:px-8'>{children}</div>;
}
