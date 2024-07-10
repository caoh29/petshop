import { VALID_ROUTES } from '@/api/routes';
import NotFound from '@/app/components/PageNotFound';

export default function AnimalPage({
  params,
}: Readonly<{
  params: { animal: string };
}>) {
  return (
    <>
      {VALID_ROUTES.has(`/${params.animal}`) ? (
        <div>{params.animal}</div>
      ) : (
        <NotFound />
      )}
    </>
  );
}
