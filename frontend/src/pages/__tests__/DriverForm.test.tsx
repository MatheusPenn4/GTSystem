import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../../styles/theme';
import { BrowserRouter } from 'react-router-dom';
import DriverForm from '../DriverForm';

// Mock dos módulos
jest.mock('../../services/api', () => ({
  post: jest.fn().mockResolvedValue({ data: { id: 1 } }),
  get: jest.fn().mockResolvedValue({ data: [] }),
}));

describe('DriverForm', () => {
  it('deve renderizar o formulário de motorista', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <DriverForm />
        </BrowserRouter>
      </ThemeProvider>
    );
    expect(screen.getByLabelText(/Nome do motorista/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CPF do motorista/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CNH do motorista/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone do motorista/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email do motorista/i)).toBeInTheDocument();
  });

  it('deve permitir preencher e submeter o formulário', async () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <DriverForm />
        </BrowserRouter>
      </ThemeProvider>
    );

    // Use act para mudanças de estado
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Nome do motorista/i), { target: { value: 'João' } });
      fireEvent.change(screen.getByLabelText(/CPF do motorista/i), {
        target: { value: '123.456.789-00' },
      });
      fireEvent.change(screen.getByLabelText(/CNH do motorista/i), {
        target: { value: '98765432100' },
      });
      fireEvent.change(screen.getByLabelText(/Telefone do motorista/i), {
        target: { value: '(11) 98888-7777' },
      });
      fireEvent.change(screen.getByLabelText(/Email do motorista/i), {
        target: { value: 'joao@email.com' },
      });
    });

    // Submete o formulário dentro de act
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /salvar|cadastrar/i }));
    });

    // Aguarde as atualizações de estado
    await waitFor(() => {
      expect(screen.getByLabelText(/Nome do motorista/i)).toHaveValue('João');
    });
  });
});
