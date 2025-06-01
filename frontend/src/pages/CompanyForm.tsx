import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  Fade,
  Zoom,
  Grid,
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

interface Company {
  id?: number;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
}

const CompanyForm: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Company>({
    name: '',
    cnpj: '',
    address: '',
    phone: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      fetchCompany();
    }
  }, [id]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Company>(`/company/companies/${id}/`);
      setFormData(response.data);
    } catch (error) {
      console.error('Erro ao carregar empresa:', error);
      setError('Não foi possível carregar os dados da empresa. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (isEditing) {
        await api.put(`/company/companies/${id}/`, formData);
        setSuccess('Empresa atualizada com sucesso!');
      } else {
        await api.post('/company/companies/', formData);
        setSuccess('Empresa cadastrada com sucesso!');
      }

      setTimeout(() => {
        navigate('/companies');
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      setError('Não foi possível salvar a empresa. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                opacity: 1,
              },
              '50%': {
                opacity: 0.5,
              },
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4,
        }}
        role="region"
        aria-label="Cabeçalho do formulário de empresa"
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1a237e 60%, #1976d2 100%)'
                : 'linear-gradient(135deg, #3b4cca 60%, #1a237e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <BusinessIcon sx={{ fontSize: 24, color: '#fff' }} />
        </Box>
        <Typography
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
          id="company-form-title"
          tabIndex={0}
        >
          {isEditing ? 'Editar Empresa' : 'Nova Empresa'}
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
          >
            {error}
          </Alert>
        </Fade>
      )}

      {success && (
        <Fade in={true}>
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              background:
                theme.palette.mode === 'dark'
                  ? 'rgba(46, 125, 50, 0.1)'
                  : 'rgba(46, 125, 50, 0.05)',
              border: '1px solid rgba(46, 125, 50, 0.2)',
            }}
          >
            {success}
          </Alert>
        </Fade>
      )}

      <Zoom in={true}>
        <Card
          sx={{
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
          }}
        >
          <CardContent>
            <form onSubmit={handleSubmit} aria-label="Formulário de empresa" autoComplete="on">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    inputProps={{ 'aria-label': 'Nome da empresa', tabIndex: 0 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CNPJ"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    required
                    inputProps={{ 'aria-label': 'CNPJ da empresa', tabIndex: 0 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    inputProps={{ 'aria-label': 'Endereço da empresa', tabIndex: 0 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    inputProps={{ 'aria-label': 'Telefone da empresa', tabIndex: 0 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    inputProps={{ 'aria-label': 'Email da empresa', tabIndex: 0 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'flex-end',
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/companies')}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        '&:hover': {
                          background:
                            theme.palette.mode === 'dark'
                              ? 'rgba(36,99,235,0.12)'
                              : 'rgba(26,35,126,0.08)',
                        },
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        borderRadius: 2,
                        px: 4,
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
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : isEditing ? (
                        'Salvar'
                      ) : (
                        'Cadastrar'
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Zoom>
    </Box>
  );
};

export default CompanyForm;
