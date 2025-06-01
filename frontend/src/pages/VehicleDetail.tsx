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
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as CarIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

interface Company {
  id: number;
  name: string;
}

interface Vehicle {
  id: number;
  plate: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  company: Company;
}

export const VehicleDetail: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Vehicle>(`/vehicle/vehicles/${id}/`);
      setVehicle(response.data);
    } catch (error) {
      console.error('Erro ao carregar veículo:', error);
      setError('Não foi possível carregar os dados do veículo. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este veículo?')) {
      return;
    }

    try {
      await api.delete(`/vehicle/vehicles/${id}/`);
      navigate('/vehicles');
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      setError('Não foi possível excluir o veículo. Tente novamente mais tarde.');
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

  if (!vehicle) {
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
          Veículo não encontrado
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vehicles')}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            borderColor:
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              background:
                theme.palette.mode === 'dark' ? 'rgba(36,99,235,0.12)' : 'rgba(26,35,126,0.08)',
            },
          }}
        >
          Voltar para Lista
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
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
            <CarIcon sx={{ fontSize: 24, color: '#fff' }} />
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
            Detalhes do Veículo
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Editar">
            <IconButton
              onClick={() => navigate(`/vehicles/${id}/edit`)}
              sx={{
                color: theme.palette.primary.main,
                background:
                  theme.palette.mode === 'dark' ? 'rgba(36,99,235,0.12)' : 'rgba(26,35,126,0.08)',
                '&:hover': {
                  background:
                    theme.palette.mode === 'dark' ? 'rgba(36,99,235,0.2)' : 'rgba(26,35,126,0.12)',
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              onClick={handleDelete}
              sx={{
                color: theme.palette.error.main,
                background:
                  theme.palette.mode === 'dark'
                    ? 'rgba(211, 47, 47, 0.12)'
                    : 'rgba(211, 47, 47, 0.08)',
                '&:hover': {
                  background:
                    theme.palette.mode === 'dark'
                      ? 'rgba(211, 47, 47, 0.2)'
                      : 'rgba(211, 47, 47, 0.12)',
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
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
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
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
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      Placa
                    </Typography>
                    <Typography variant="body1">{vehicle.plate}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      Modelo
                    </Typography>
                    <Typography variant="body1">{vehicle.model}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      Marca
                    </Typography>
                    <Typography variant="body1">{vehicle.brand}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      Ano
                    </Typography>
                    <Typography variant="body1">{vehicle.year}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      Cor
                    </Typography>
                    <Typography variant="body1">{vehicle.color}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                      }}
                    >
                      Empresa
                    </Typography>
                    <Typography variant="body1">{vehicle.company.name}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 4,
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/vehicles')}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  borderColor:
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background:
                      theme.palette.mode === 'dark'
                        ? 'rgba(36,99,235,0.12)'
                        : 'rgba(26,35,126,0.08)',
                  },
                }}
              >
                Voltar para Lista
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Zoom>
    </Box>
  );
};
