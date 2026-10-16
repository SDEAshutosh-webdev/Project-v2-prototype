import { describe, it, expect } from 'vitest';
import { assessmentUnitSchema, assessmentUnitCreateSchema } from '@/modules/property-tax/domain/schemas/AssessmentUnitSchema';

describe('AssessmentUnitSchema (Zod Validation at Boundaries)', () => {
  it('should validate and parse valid assessment unit payload', () => {
    const raw = {
      id: 'unit-101',
      propertyId: 'PROP-101',
      unitNo: 'FLAT-302',
      floorNumber: '3',
      occupantName: 'Ramesh Sharma',
      usageTypeId: '1',
      builtUpArea: '850.5',
      carpetArea: 680,
      rateableValue: '18500',
      capitalValue: '4500000',
      status: 'ASSESSED',
    };

    const parsed = assessmentUnitSchema.safeParse(raw);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.id).toBe('unit-101');
      expect(parsed.data.floorNumber).toBe(3);
      expect(parsed.data.builtUpArea).toBe(850.5);
      expect(parsed.data.usageTypeId).toBe(1);
      expect(parsed.data.status).toBe('ASSESSED');
    }
  });

  it('should validate creation schema without id', () => {
    const createPayload = {
      propertyId: 'PROP-101',
      unitNo: 'FLAT-302',
      floorNumber: 3,
      occupantName: 'Ramesh Sharma',
      usageTypeId: 1,
      builtUpArea: 850.5,
      carpetArea: 680,
      rateableValue: 18500,
      capitalValue: 4500000,
      status: 'ASSESSED' as const,
    };

    const parsed = assessmentUnitCreateSchema.safeParse(createPayload);
    expect(parsed.success).toBe(true);
  });

  it('should reject invalid payloads with clear error messages', () => {
    const invalid = {
      id: 'unit-1',
      propertyId: '',
      unitNo: '',
      floorNumber: -2,
      occupantName: 'A',
      usageTypeId: 0,
      builtUpArea: -100,
      carpetArea: 0,
    };

    const parsed = assessmentUnitSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      expect(fieldErrors.propertyId).toBeDefined();
      expect(fieldErrors.unitNo).toBeDefined();
      expect(fieldErrors.floorNumber).toBeDefined();
      expect(fieldErrors.builtUpArea).toBeDefined();
    }
  });
});
