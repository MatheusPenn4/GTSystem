import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  useTheme,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(120deg, #0a0a0f 0%, #1a237e 100%)'
            : 'linear-gradient(120deg, #f4f8fb 0%, #1a237e 100%)',
        p: { xs: 2, sm: 3 }, // Ajustado o padding para melhor visualização
        boxSizing: 'border-box',
        overflow: 'hidden', // Previne scroll indesejado
      }}
      role="main"
      aria-label="Tela de login do sistema"
    >
      <Zoom in={true}>
        <Card
          sx={{
            width: '100%',
            maxWidth: { xs: '95%', sm: '90%', md: 400 }, // Melhorado para diferentes breakpoints
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(18,32,47,0.95) 60%, rgba(26,35,126,0.85) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.95) 60%, rgba(26,35,126,0.08) 100%)',
            backdropFilter: 'blur(8px)',
            border:
              theme.palette.mode === 'dark'
                ? '1px solid rgba(36,99,235,0.12)'
                : '1px solid rgba(26,35,126,0.08)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            borderRadius: 4,
            margin: '0 auto', // Garante centralização horizontal
          }}
          role="form"
          aria-labelledby="login-title"
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #1a237e 60%, #1976d2 100%)'
                      : 'linear-gradient(135deg, #3b4cca 60%, #1a237e 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                aria-hidden="true"
              >
                <LoginIcon sx={{ fontSize: 32, color: '#fff' }} />
              </Box>
              <Typography
                id="login-title"
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  letterSpacing: '-1px',
                  textShadow:
                    theme.palette.mode === 'dark'
                      ? '0 2px 8px rgba(0,0,0,0.3)'
                      : '0 2px 8px rgba(26,35,126,0.1)',
                }}
                tabIndex={0}
              >
                Login
              </Typography>
            </Box>

            {error && (
              <Fade in={true}>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    background:
                      theme.palette.mode === 'dark'
                        ? 'rgba(211, 47, 47, 0.1)'
                        : 'rgba(211, 47, 47, 0.05)',
                    border: '1px solid rgba(211, 47, 47, 0.2)',
                  }}
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </Alert>
              </Fade>
            )}

            <form onSubmit={handleSubmit} aria-label="Formulário de login" autoComplete="on">
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
                inputProps={{
                  'aria-label': 'Digite seu e-mail',
                  tabIndex: 0,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(26,35,126,0.5)',
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
                inputProps={{
                  'aria-label': 'Digite sua senha',
                  tabIndex: 0,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        tabIndex={0}
                        sx={{
                          color:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255,255,255,0.7)'
                              : 'rgba(0,0,0,0.54)',
                        }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(26,35,126,0.5)',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  height: 48,
                  borderRadius: 2,
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(90deg, #1a237e 60%, #1976d2 100%)'
                      : 'linear-gradient(90deg, #3b4cca 60%, #1a237e 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': {
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(90deg, #1976d2 60%, #1a237e 100%)'
                        : 'linear-gradient(90deg, #1a237e 60%, #3b4cca 100%)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  },
                }}
                aria-label="Entrar no sistema"
                tabIndex={0}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Zoom>
    </Box>
  );
};

export default Login;
