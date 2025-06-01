import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../../../styles/theme';
import AuthProvider from '../../../context/AuthContext';
import Login from '../Login';
import api from '../../../services/api';

jest.mock('../../../services/api');

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário de login', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    );

    expect(screen.getByLabelText('Digite seu e-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Digite sua senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve fazer login com sucesso', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: {
        access: 'fake-token',
        refresh: 'fake-refresh-token',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
      },
    });

    // Mock do endpoint de usuário
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      },
    });

    render(
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    );

    fireEvent.change(screen.getByLabelText('Digite seu e-mail'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Digite sua senha'), {
      target: { value: 'password123' },
    });

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login/', {
        username: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
