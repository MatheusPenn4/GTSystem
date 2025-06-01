import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../../styles/theme';
import Dashboard from '../Dashboard';

jest.mock('../../services/api');
import api from '../../services/api';

describe('Dashboard', () => {
  beforeEach(() => {
    (api.get as jest.Mock).mockImplementation((url: string) => {
      if (url === '/dashboard/stats/') {
        return Promise.resolve({
          data: {
            total_vehicles: 10,
            total_parking_lots: 0,
            total_companies: 3,
          },
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('deve renderizar os cards de estatísticas corretamente', async () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Total de Empresas')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Total de Estacionamentos')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Total de Veículos')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  it('deve mostrar loading enquanto carrega os dados', () => {
    (api.get as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </ThemeProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro quando a API falha', async () => {
    (api.get as jest.Mock).mockImplementation(() => Promise.reject(new Error('API Error')));

    render(
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Não foi possível carregar as estatísticas'
      );
    });
  });
});
