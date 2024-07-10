import { VALID_ROUTES } from '@/api/routes';
import NotFound from '@/app/components/PageNotFound';

export default function AnimalDescriptionPage({
  params,
}: Readonly<{
  params: { animal: string; description: string };
}>) {
  return (
    <>
      {VALID_ROUTES.has(`/${params.animal}/${params.description}`) ? (
        <div>
          {params.animal} - {params.description}
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
}
