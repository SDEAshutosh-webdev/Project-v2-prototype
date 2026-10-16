import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchAssessmentUnits } from '@/modules/property-tax/hooks/useAssessment';
import { ApartmentAssessmentView } from '@/modules/property-tax/views/ApartmentAssessmentView';

export const metadata = {
  title: 'Apartment Assessment | NTIS Enterprise',
  description: 'Municipal property tax assessment register and unit ledgers',
};

interface PageProps {
  searchParams: Promise<{ propertyId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const propertyId = params && params.propertyId ? params.propertyId : 'PROP-MAH-401';

  const queryClient = new QueryClient();

  await prefetchAssessmentUnits(queryClient, { propertyId: propertyId });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApartmentAssessmentView initialParams={{ propertyId: propertyId }} />
    </HydrationBoundary>
  );
}
