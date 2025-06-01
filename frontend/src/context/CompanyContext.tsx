import React, { createContext, useContext, useState, useCallback } from 'react';
import { Company, CompanyFormData, useCompany } from '../hooks/useCompany';

interface CompanyContextData {
  companies: Company[];
  loading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  createCompany: (data: CompanyFormData) => Promise<void>;
  updateCompany: (id: number, data: CompanyFormData) => Promise<void>;
  deleteCompany: (id: number) => Promise<void>;
}

const CompanyContext = createContext<CompanyContextData>({} as CompanyContextData);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const {
    loading,
    error,
    fetchCompanies: fetchCompaniesHook,
    createCompany: createCompanyHook,
    updateCompany: updateCompanyHook,
    deleteCompany: deleteCompanyHook,
  } = useCompany();

  const fetchCompanies = useCallback(async () => {
    const data = await fetchCompaniesHook();
    setCompanies(data);
  }, [fetchCompaniesHook]);

  const createCompany = useCallback(
    async (data: CompanyFormData) => {
      const newCompany = await createCompanyHook(data);
      setCompanies((prev) => [...prev, newCompany]);
    },
    [createCompanyHook]
  );

  const updateCompany = useCallback(
    async (id: number, data: CompanyFormData) => {
      const updatedCompany = await updateCompanyHook(id, data);
      setCompanies((prev) => prev.map((company) => (company.id === id ? updatedCompany : company)));
    },
    [updateCompanyHook]
  );

  const deleteCompany = useCallback(
    async (id: number) => {
      await deleteCompanyHook(id);
      setCompanies((prev) => prev.filter((company) => company.id !== id));
    },
    [deleteCompanyHook]
  );

  return (
    <CompanyContext.Provider
      value={{
        companies,
        loading,
        error,
        fetchCompanies,
        createCompany,
        updateCompany,
        deleteCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyContext must be used within a CompanyProvider');
  }
  return context;
};
