interface Props {
  className?: string;
}

export default function Logo({ className }: Readonly<Props>) {
  return (
    <figure
      className={`${className} text-3xl font-semibold text-secondary tracking-tight`}
    >
      PetShop
    </figure>
  );
}
