import { useState, useCallback } from 'react';
import api from '../services/api';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface UserProfileFormData {
  name: string;
  email: string;
  phone: string;
}

export interface CompanySettings {
  id: number;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
}

export interface CompanySettingsFormData {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
}

export const useSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/auth/users/me/');

      // Verificar se a resposta existe
      if (!response || !response.data) {
        console.warn('Resposta vazia da API de perfil');
        throw new Error('Não foi possível obter os dados do perfil');
      }

      // Mapear a resposta para o formato esperado
      return {
        id: response.data.id,
        name: response.data.first_name
          ? `${response.data.first_name} ${response.data.last_name || ''}`.trim()
          : response.data.username,
        email: response.data.email,
        phone: response.data.phone || '',
      };
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err);
      if (err.response && err.response.data) {
        if (err.response.data.detail) {
          setError(`Não foi possível carregar seu perfil: ${err.response.data.detail}`);
        } else {
          setError('Não foi possível carregar seu perfil. Verifique se você está logado.');
        }
      } else if (err.message) {
        setError(`Erro ao carregar perfil: ${err.message}`);
      } else {
        setError('Não foi possível carregar as configurações do perfil.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (data: UserProfileFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch('/auth/users/me/', {
        first_name: data.name.split(' ')[0],
        last_name: data.name.split(' ').slice(1).join(' ') || null,
        email: data.email,
        phone: data.phone,
      });

      // Verificar se a resposta existe
      if (!response || !response.data) {
        throw new Error('Não foi possível atualizar o perfil');
      }

      // Mapear a resposta para o formato esperado
      return {
        id: response.data.id,
        name: `${response.data.first_name} ${response.data.last_name || ''}`.trim(),
        email: response.data.email,
        phone: response.data.phone || '',
      };
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object' && Object.keys(err.response.data).length > 0) {
          // Formata erros de validação
          const errorMessages = Object.entries(err.response.data)
            .map(
              ([field, messages]: [string, any]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('; ');
          setError(`Não foi possível atualizar o perfil: ${errorMessages}`);
        } else if (err.response.data.detail) {
          setError(`Não foi possível atualizar o perfil: ${err.response.data.detail}`);
        } else {
          setError('Não foi possível atualizar o perfil.');
        }
      } else {
        setError('Não foi possível atualizar o perfil.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCompanySettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/company/companies/current/');

      // Verificar se a resposta existe
      if (!response || !response.data) {
        console.warn('Resposta vazia da API de empresa');
        throw new Error('Não foi possível obter os dados da empresa');
      }

      return response.data;
    } catch (err: any) {
      console.error('Erro ao carregar configurações da empresa:', err);
      if (err.response && err.response.status === 404) {
        // Não encontrou a empresa, pode ser que o usuário não tenha uma empresa associada
        setError('Você não tem uma empresa associada ao seu perfil.');
      } else if (err.response && err.response.data) {
        if (err.response.data.detail) {
          setError(
            `Não foi possível carregar as configurações da empresa: ${err.response.data.detail}`
          );
        } else {
          setError('Não foi possível carregar as configurações da empresa.');
        }
      } else if (err.message) {
        setError(`Erro ao carregar configurações da empresa: ${err.message}`);
      } else {
        setError('Não foi possível carregar as configurações da empresa.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompanySettings = useCallback(async (data: CompanySettingsFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/company/companies/current/', data);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao atualizar configurações da empresa:', err);
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object' && Object.keys(err.response.data).length > 0) {
          // Formata erros de validação
          const errorMessages = Object.entries(err.response.data)
            .map(
              ([field, messages]: [string, any]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('; ');
          setError(`Não foi possível atualizar as configurações da empresa: ${errorMessages}`);
        } else if (err.response.data.detail) {
          setError(
            `Não foi possível atualizar as configurações da empresa: ${err.response.data.detail}`
          );
        } else {
          setError('Não foi possível atualizar as configurações da empresa.');
        }
      } else {
        setError('Não foi possível atualizar as configurações da empresa.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    fetchCompanySettings,
    updateCompanySettings,
  };
};
