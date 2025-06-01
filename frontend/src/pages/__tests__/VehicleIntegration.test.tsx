import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../../styles/theme';
import VehicleForm from '../VehicleForm';
import VehicleList from '../VehicleList';
jest.mock('../../services/api');
import api from '../../services/api';

const mockVehicles = [
  {
    id: 1,
    plate: 'ABC-1234',
    model: 'Fusca',
    year: 1972,
    color: 'Azul',
    company: 1,
  },
];

describe('Vehicle Integration', () => {
  beforeEach(() => {
    mockVehicles.length = 1;
    (api.get as jest.Mock).mockImplementation((url: string) => {
      if (url === '/company/vehicles/') {
        return Promise.resolve({ data: mockVehicles });
      }
      if (url === '/company/companies/') {
        return Promise.resolve({ data: [{ id: 1, name: 'Empresa Teste' }] });
      }
      return Promise.reject(new Error('Not found'));
    });
    (api.post as jest.Mock).mockImplementation((url: string, data: any) => {
      if (url === '/company/vehicles/') {
        const newVehicle = { ...data, id: mockVehicles.length + 1 };
        mockVehicles.push(newVehicle);
        return Promise.resolve({ data: newVehicle });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('deve criar um veículo corretamente', async () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <VehicleForm />
        </BrowserRouter>
      </ThemeProvider>
    );

    fireEvent.change(await screen.findByLabelText(/Placa/i), { target: { value: 'XYZ-9876' } });
    fireEvent.change(screen.getByLabelText(/Modelo/i), { target: { value: 'Volkswagen Gol' } });
    fireEvent.change(screen.getByLabelText(/Ano/i), { target: { value: 2022 } });
    fireEvent.change(screen.getByLabelText(/Cor/i), { target: { value: 'Azul' } });

    const empresaSelect = screen.getByLabelText(/Empresa/i);
    fireEvent.mouseDown(empresaSelect);
    const option = await screen.findByText('Empresa Teste');
    fireEvent.click(option);

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/company/vehicles/', {
        plate: 'XYZ-9876',
        model: 'Volkswagen Gol',
        year: 2022,
        color: 'Azul',
        company: 1,
      });
    });
  });
});
