import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchAssessmentUnits } from '@/modules/property-tax/application/hooks/useAssessmentUnits';
import { ApartmentAssessmentPage } from '@/modules/property-tax/presentation/pages/ApartmentAssessmentPage';

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
      <ApartmentAssessmentPage initialParams={{ propertyId: propertyId }} />
    </HydrationBoundary>
  );
}
