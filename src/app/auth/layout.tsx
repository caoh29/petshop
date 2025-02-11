export default async function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-accent'>
      {children}
    </div>
  );
}
