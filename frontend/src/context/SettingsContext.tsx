import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  UserProfile,
  UserProfileFormData,
  CompanySettings,
  CompanySettingsFormData,
  useSettings,
} from '../hooks/useSettings';

interface SettingsContextData {
  userProfile: UserProfile | null;
  companySettings: CompanySettings | null;
  loading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (data: UserProfileFormData) => Promise<void>;
  fetchCompanySettings: () => Promise<void>;
  updateCompanySettings: (data: CompanySettingsFormData) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextData>({} as SettingsContextData);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const {
    loading,
    error,
    fetchUserProfile: fetchUserProfileHook,
    updateUserProfile: updateUserProfileHook,
    fetchCompanySettings: fetchCompanySettingsHook,
    updateCompanySettings: updateCompanySettingsHook,
  } = useSettings();

  const fetchUserProfile = useCallback(async () => {
    const data = await fetchUserProfileHook();
    setUserProfile(data);
  }, [fetchUserProfileHook]);

  const updateUserProfile = useCallback(
    async (data: UserProfileFormData) => {
      const updatedProfile = await updateUserProfileHook(data);
      setUserProfile(updatedProfile);
    },
    [updateUserProfileHook]
  );

  const fetchCompanySettings = useCallback(async () => {
    const data = await fetchCompanySettingsHook();
    setCompanySettings(data);
  }, [fetchCompanySettingsHook]);

  const updateCompanySettings = useCallback(
    async (data: CompanySettingsFormData) => {
      const updatedSettings = await updateCompanySettingsHook(data);
      setCompanySettings(updatedSettings);
    },
    [updateCompanySettingsHook]
  );

  return (
    <SettingsContext.Provider
      value={{
        userProfile,
        companySettings,
        loading,
        error,
        fetchUserProfile,
        updateUserProfile,
        fetchCompanySettings,
        updateCompanySettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};
