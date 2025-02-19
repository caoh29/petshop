interface Props {
  params: {
    id: string;
  };
}

export default function AdminProductByIdPage({ params }: Readonly<Props>) {
  return <div>Product ID: {params.id}</div>;
}
