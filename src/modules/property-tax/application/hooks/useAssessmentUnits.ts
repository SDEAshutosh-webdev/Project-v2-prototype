import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { assessmentApi, AssessmentQueryParams } from '../../infrastructure/api/assessmentApi';
import { AssessmentUnitFormValues } from '../../domain/schemas/AssessmentUnitSchema';

export const ptisKeys = {
  all: ['ptis'] as const,
  units: (params?: AssessmentQueryParams) => [...ptisKeys.all, 'units', params] as const,
};

export async function prefetchAssessmentUnits(queryClient: QueryClient, params?: AssessmentQueryParams) {
  return queryClient.prefetchQuery({
    queryKey: ptisKeys.units(params),
    queryFn: () => assessmentApi.getAll(params),
  });
}

export function useAssessmentUnits(params?: AssessmentQueryParams) {
  return useQuery({
    queryKey: ptisKeys.units(params),
    queryFn: () => assessmentApi.getAll(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateAssessmentUnit(params?: AssessmentQueryParams) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: AssessmentUnitFormValues) => assessmentApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ptisKeys.units(params) });
    },
  });
}
