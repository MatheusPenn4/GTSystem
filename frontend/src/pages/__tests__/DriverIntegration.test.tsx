import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../../styles/theme';
import DriverForm from '../DriverForm';
import DriverList from '../DriverList';

jest.mock('../../services/api');
import api from '../../services/api';

const mockDrivers = [
  {
    id: 1,
    name: 'João Silva',
    cpf: '12345678900',
    license: '98765432100',
    phone: '11999999999',
    email: 'joao@email.com',
  },
];

describe('Driver Integration', () => {
  beforeEach(() => {
    mockDrivers.length = 1;
    (api.get as jest.Mock).mockImplementation((url: string) => {
      if (url === '/company/drivers/') {
        return Promise.resolve({ data: mockDrivers });
      }
      return Promise.reject(new Error('Not found'));
    });
    (api.post as jest.Mock).mockImplementation((url: string, data: any) => {
      if (url === '/company/drivers/') {
        const newDriver = { ...data, id: mockDrivers.length + 1 };
        mockDrivers.push(newDriver);
        return Promise.resolve({ data: newDriver });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('deve criar um motorista corretamente', async () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <DriverForm />
        </BrowserRouter>
      </ThemeProvider>
    );

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Maria Santos' } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '98765432100' } });
    fireEvent.change(screen.getByLabelText(/CNH/i), { target: { value: '12345678900' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11988888888' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'maria@email.com' } });

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/company/drivers/', {
        name: 'Maria Santos',
        cpf: '98765432100',
        license: '12345678900',
        email: 'maria@email.com',
        phone: '11988888888',
      });
    });
  });
});
