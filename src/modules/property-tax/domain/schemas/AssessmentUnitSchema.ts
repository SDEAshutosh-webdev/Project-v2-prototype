import { z } from 'zod';

export const assessmentUnitSchema = z.object({
  id: z.string(),
  propertyId: z.string().min(1, 'Property ID is required'),
  unitNo: z.string().min(1, 'Unit number is required'),
  floorNumber: z.coerce.number().min(0, 'Floor number must be 0 or higher'),
  occupantName: z.string().min(2, 'Occupant name is required'),
  usageTypeId: z.coerce.number().min(1, 'Select a valid usage type'),
  usageType: z.string().default('Residential Flat'),
  builtUpArea: z.coerce.number().positive('Built-up area must be greater than 0'),
  carpetArea: z.coerce.number().positive('Carpet area must be greater than 0'),
  rateableValue: z.coerce.number().min(0).default(0),
  capitalValue: z.coerce.number().min(0).default(0),
  annualTax: z.coerce.number().min(0).default(0),
  status: z.enum(['ASSESSED', 'PENDING', 'DISPUTED']).default('ASSESSED'),
  hasDiscrepancy: z.boolean().default(false),
});

export const assessmentUnitCreateSchema = assessmentUnitSchema.omit({ id: true });

export const pagedAssessmentUnitsResponseSchema = z.object({
  items: z.array(assessmentUnitSchema),
  totalCount: z.number(),
  pageNumber: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  hasPrevious: z.boolean(),
  hasNext: z.boolean(),
});

export type AssessmentUnitFormValues = z.infer<typeof assessmentUnitCreateSchema>;
