import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../../styles/theme';
import { BrowserRouter } from 'react-router-dom';
import CompanyForm from '../CompanyForm';

jest.mock('../../services/api', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  get: jest.fn(() =>
    Promise.resolve({ data: { name: '', cnpj: '', address: '', phone: '', email: '' } })
  ),
}));

describe('CompanyForm', () => {
  it('deve renderizar o formulário de empresa', async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <BrowserRouter>
            <CompanyForm />
          </BrowserRouter>
        </ThemeProvider>
      );
    });

    expect(screen.getByLabelText(/Nome da empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CNPJ da empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Endereço da empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone da empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email da empresa/i)).toBeInTheDocument();
  });

  it('deve permitir preencher e submeter o formulário', async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={lightTheme}>
          <BrowserRouter>
            <CompanyForm />
          </BrowserRouter>
        </ThemeProvider>
      );
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Nome da empresa/i), {
        target: { value: 'Empresa Teste' },
      });
      fireEvent.change(screen.getByLabelText(/CNPJ da empresa/i), {
        target: { value: '12.345.678/0001-99' },
      });
      fireEvent.change(screen.getByLabelText(/Endereço da empresa/i), {
        target: { value: 'Rua Teste, 123' },
      });
      fireEvent.change(screen.getByLabelText(/Telefone da empresa/i), {
        target: { value: '(11) 99999-9999' },
      });
      fireEvent.change(screen.getByLabelText(/Email da empresa/i), {
        target: { value: 'empresa@teste.com' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /salvar|cadastrar/i }));
    });

    expect(screen.getByLabelText(/Nome da empresa/i)).toHaveValue('Empresa Teste');
  });
});
