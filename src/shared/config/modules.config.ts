export type ProductModule = 'PTIS' | 'WTIS' | 'ASSETS' | 'GRIEVANCE' | 'FIRE_AUDIT';

export interface TenantProductConfig {
  tenantId: string;
  ulbCode: string;
  ulbName: string;
  enabledModules: ProductModule[];
  features?: Record<string, boolean>;
}

export const DEFAULT_PRODUCT_CONFIG: TenantProductConfig = {
  tenantId: 'ULB-101',
  ulbCode: 'MUMBAI_MC',
  ulbName: 'Municipal Corporation',
  enabledModules: ['PTIS', 'WTIS', 'ASSETS', 'GRIEVANCE'],
  features: {
    ENABLE_DIFFERENCE_ENGINE: true,
    ENABLE_GIS_WAYBACK: true,
  },
};
