interface Props {
  className?: string;
}

export default function Logo({ className }: Readonly<Props>) {
  return (
    <h2
      className={`${className} scroll-m-20 text-3xl font-semibold text-secondary tracking-tight mx-auto`}
    >
      PetShop
    </h2>
  );
}
