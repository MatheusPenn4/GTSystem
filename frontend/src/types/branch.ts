export interface Branch {
  id: number;
  name: string;
  companyId: number;
  companyName?: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}
