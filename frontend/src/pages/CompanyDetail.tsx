import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  Fade,
  Zoom,
  Grid,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

interface Company {
  id: number;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
}

export const CompanyDetail: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Company>(`/company/companies/${id}/`);
      setCompany(response.data);
    } catch (error) {
      console.error('Erro ao carregar empresa:', error);
      setError('Não foi possível carregar os dados da empresa. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      return;
    }

    try {
      await api.delete(`/company/companies/${id}/`);
      navigate('/companies');
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      setError('Não foi possível excluir a empresa. Tente novamente mais tarde.');
    }
  };

  if (loading) {
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

  if (!company) {
    return (
      <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            background:
              theme.palette.mode === 'dark' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)',
            border: '1px solid rgba(211, 47, 47, 0.2)',
          }}
        >
          Empresa não encontrada.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/companies')}
          sx={{
            borderRadius: 2,
            px: 4,
            '&:hover': {
              background:
                theme.palette.mode === 'dark' ? 'rgba(36,99,235,0.12)' : 'rgba(26,35,126,0.08)',
            },
          }}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 }, width: '100%', maxWidth: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          >
            Detalhes da Empresa
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/companies')}
            sx={{
              borderRadius: 2,
              px: 4,
              '&:hover': {
                background:
                  theme.palette.mode === 'dark' ? 'rgba(36,99,235,0.12)' : 'rgba(26,35,126,0.08)',
              },
            }}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/companies/${id}/edit`)}
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
            Editar
          </Button>
        </Box>
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
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  Informações Básicas
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      Nome
                    </Typography>
                    <Typography variant="body1">{company.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      CNPJ
                    </Typography>
                    <Typography variant="body1">{company.cnpj}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  Contato
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      Endereço
                    </Typography>
                    <Typography variant="body1">{company.address}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      Telefone
                    </Typography>
                    <Typography variant="body1">{company.phone}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      Email
                    </Typography>
                    <Typography variant="body1">{company.email}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Tooltip title="Excluir Empresa">
                    <IconButton
                      onClick={handleDelete}
                      sx={{
                        color: theme.palette.error.main,
                        '&:hover': {
                          background:
                            theme.palette.mode === 'dark'
                              ? 'rgba(211, 47, 47, 0.12)'
                              : 'rgba(211, 47, 47, 0.08)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Zoom>
    </Box>
  );
};
