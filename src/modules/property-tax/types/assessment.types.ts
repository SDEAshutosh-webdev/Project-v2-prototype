export interface AssessmentUnit {
  id: string;
  propertyId: string;
  unitNo: string;
  floorNumber: number;
  occupantName: string;
  usageType: string;
  usageTypeId: number;
  builtUpArea: number;
  carpetArea: number;
  rateableValue: number;
  capitalValue: number;
  annualTax: number;
  status: 'ASSESSED' | 'PENDING' | 'DISPUTED';
  hasDiscrepancy?: boolean;
}
