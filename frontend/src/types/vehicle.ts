export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  brand: string;
  color: string;
  year: number;
  company: number;
  company_name?: string;
  branch?: number;
  branch_name?: string;
  driver?: number;
  driver_name?: string;
  created_at?: string;
  updated_at?: string;
  status?: 'active' | 'maintenance' | 'inactive';
}
