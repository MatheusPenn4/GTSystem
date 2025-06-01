import React, { createContext, useContext, useState, useCallback } from 'react';
import { Branch, BranchFormData, useBranch } from '../hooks/useBranch';

interface BranchContextData {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  fetchBranches: () => Promise<void>;
  createBranch: (data: BranchFormData) => Promise<void>;
  updateBranch: (id: number, data: BranchFormData) => Promise<void>;
  deleteBranch: (id: number) => Promise<void>;
}

const BranchContext = createContext<BranchContextData>({} as BranchContextData);

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const {
    loading,
    error,
    fetchBranches: fetchBranchesHook,
    createBranch: createBranchHook,
    updateBranch: updateBranchHook,
    deleteBranch: deleteBranchHook,
  } = useBranch();

  const fetchBranches = useCallback(async () => {
    const data = await fetchBranchesHook();
    setBranches(data);
  }, [fetchBranchesHook]);

  const createBranch = useCallback(
    async (data: BranchFormData) => {
      const newBranch = await createBranchHook(data);
      setBranches((prev) => [...prev, newBranch]);
    },
    [createBranchHook]
  );

  const updateBranch = useCallback(
    async (id: number, data: BranchFormData) => {
      const updatedBranch = await updateBranchHook(id, data);
      setBranches((prev) => prev.map((branch) => (branch.id === id ? updatedBranch : branch)));
    },
    [updateBranchHook]
  );

  const deleteBranch = useCallback(
    async (id: number) => {
      await deleteBranchHook(id);
      setBranches((prev) => prev.filter((branch) => branch.id !== id));
    },
    [deleteBranchHook]
  );

  return (
    <BranchContext.Provider
      value={{
        branches,
        loading,
        error,
        fetchBranches,
        createBranch,
        updateBranch,
        deleteBranch,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranchContext = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranchContext must be used within a BranchProvider');
  }
  return context;
};
