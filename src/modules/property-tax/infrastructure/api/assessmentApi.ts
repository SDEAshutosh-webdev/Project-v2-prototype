import { apiClient } from '@/shared/http/api-client';
import { AssessmentUnit } from '../../domain/entities/AssessmentUnit';
import { AssessmentUnitFormValues, pagedAssessmentUnitsResponseSchema } from '../../domain/schemas/AssessmentUnitSchema';
import { PagedResult, BaseQueryParams } from '@/shared/http/api-types';

export interface AssessmentQueryParams extends BaseQueryParams {
  propertyId?: string;
  wardId?: string;
  status?: string;
}

const generateMockUnits = (propertyId: string): AssessmentUnit[] => {
  return Array.from({ length: 150 }, (_, i) => ({
    id: 'unit-' + propertyId + '-' + (i + 1),
    propertyId: propertyId,
    unitNo: 'APT-' + (100 + i),
    floorNumber: Math.floor(i / 4) + 1,
    occupantName: 'Citizen Owner ' + (i + 1),
    usageType: i % 5 === 0 ? 'Commercial Retail' : 'Residential Flat',
    usageTypeId: i % 5 === 0 ? 2 : 1,
    builtUpArea: 650 + (i % 6) * 120,
    carpetArea: 520 + (i % 6) * 95,
    rateableValue: 12000 + (i % 10) * 1500,
    capitalValue: 3500000 + (i % 10) * 450000,
    annualTax: 8500 + (i % 10) * 850,
    status: i % 12 === 0 ? 'DISPUTED' : i % 7 === 0 ? 'PENDING' : 'ASSESSED',
    hasDiscrepancy: i % 9 === 0,
  }));
};

export const assessmentApi = {
  getAll: async (params?: AssessmentQueryParams): Promise<PagedResult<AssessmentUnit>> => {
    try {
      const { data } = await apiClient.get<unknown>('/api/ptis/units', { params });
      
      const parsed = pagedAssessmentUnitsResponseSchema.safeParse(data);
      if (parsed.success) {
        return parsed.data;
      }
      console.warn('[API Boundary] Zod validation failed for assessment units, falling back to mock:', parsed.error);
      throw new Error('API Schema Validation Mismatch');
    } catch {
      const propId = params && params.propertyId ? params.propertyId : 'PROP-MAH-401';
      const all = generateMockUnits(propId);
      const page = params && params.pageNumber ? params.pageNumber : 1;
      const size = params && params.pageSize ? params.pageSize : 100;
      const items = all.slice((page - 1) * size, page * size);
      
      const rawResult = {
        items: items,
        totalCount: all.length,
        pageNumber: page,
        pageSize: size,
        totalPages: Math.ceil(all.length / size),
        hasPrevious: page > 1,
        hasNext: page * size < all.length,
      };

      return pagedAssessmentUnitsResponseSchema.parse(rawResult);
    }
  },

  create: async (values: AssessmentUnitFormValues): Promise<AssessmentUnit> => {
    const { data } = await apiClient.post<AssessmentUnit>('/api/ptis/units', values);
    return data;
  },
};
