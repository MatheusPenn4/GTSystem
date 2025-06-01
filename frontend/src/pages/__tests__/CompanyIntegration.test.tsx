import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../../styles/theme';
import CompanyForm from '../CompanyForm';
import CompanyList from '../CompanyList';

jest.mock('../../services/api');
import api from '../../services/api';

const mockCompanies = [
  {
    id: 1,
    name: 'Empresa Teste',
    cnpj: '12345678901234',
    phone: '11999999999',
  },
];

describe('Company Integration', () => {
  beforeEach(() => {
    mockCompanies.length = 1;
    (api.get as jest.Mock).mockImplementation((url: string) => {
      if (url === '/company/companies/') {
        return Promise.resolve({ data: mockCompanies });
      }
      return Promise.reject(new Error('Not found'));
    });
    (api.post as jest.Mock).mockImplementation((url: string, data: any) => {
      if (url === '/company/companies/') {
        const newCompany = { ...data, id: mockCompanies.length + 1 };
        mockCompanies.push(newCompany);
        return Promise.resolve({ data: newCompany });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('deve criar uma empresa e exibi-la na lista', async () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <CompanyForm />
        </BrowserRouter>
      </ThemeProvider>
    );

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Nova Empresa' } });
    fireEvent.change(screen.getByLabelText(/CNPJ/i), { target: { value: '98765432109876' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11977777777' } });

    const submitButton = screen.getByRole('button', { name: /cadastrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/company/companies/', {
        name: 'Nova Empresa',
        cnpj: '98765432109876',
        phone: '11977777777',
        address: '',
        email: '',
      });
    });

    render(
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <CompanyList />
        </BrowserRouter>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: 'Nova Empresa' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '98765432109876' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '11977777777' })).toBeInTheDocument();
    });
  });
});
