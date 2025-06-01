import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  Fade,
  Card,
  CardContent,
  Zoom,
  Grid,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { DirectionsCar } from '@mui/icons-material';
import { useVehicleContext } from '../context/VehicleContext';
import { useDriverContext } from '../context/DriverContext';

// Interface local para o formulário
interface VehicleFormData {
  plate: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  status: 'active' | 'maintenance' | 'inactive';
  branch?: number;
  driver?: number;
}

// Estendendo a interface para incluir o campo company necessário no formulário
interface ExtendedVehicleFormData extends VehicleFormData {
  company: string;
}

interface Company {
  id: string;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

const VehicleForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;
  const queryParams = new URLSearchParams(location.search);
  const preselectedCompanyId = queryParams.get('company');
  const theme = useTheme();
  const { createVehicle, updateVehicle, loading: vehicleLoading } = useVehicleContext();
  const { drivers, fetchDrivers, loading: driversLoading } = useDriverContext();

  const [formData, setFormData] = useState<ExtendedVehicleFormData>({
    plate: '',
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    color: '',
    status: 'active',
    company: preselectedCompanyId || '',
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(isEditMode);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/company/companies/');
        const companiesData = response.data.results || response.data;
        setCompanies(Array.isArray(companiesData) ? companiesData : []);
        setLoadingCompanies(false);
      } catch (err) {
        setError('Não foi possível carregar a lista de empresas.');
        setLoadingCompanies(false);
        setCompanies([]);
      }
    };

    fetchCompanies();

    if (isEditMode) {
      const fetchVehicle = async () => {
        try {
          const response = await api.get(`/company/vehicles/${id}/`);
          const vehicleData = response.data;
          if (vehicleData.company && typeof vehicleData.company === 'object') {
            vehicleData.company = vehicleData.company.id;
          }
          setFormData(vehicleData);
          setLoading(false);
        } catch (err) {
          setError('Não foi possível carregar os dados do veículo.');
          setLoading(false);
        }
      };
      fetchVehicle();
    }
  }, [id, isEditMode, preselectedCompanyId]);

  useEffect(() => {
    const loadDriversAndBranches = async () => {
      try {
        await fetchDrivers();
        await fetchBranches();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadDriversAndBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ignorar eslint para evitar loop infinito com fetchDrivers

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const response = await api.get('/company/branches/');
      setBranches(response.data.results || response.data);
    } catch (error) {
      console.error('Erro ao carregar filiais:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar filiais. Tente novamente.',
        severity: 'error',
      });
    } finally {
      setLoadingBranches(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name === 'plate') {
      let formattedValue = String(value)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');
      if (formattedValue.length > 3) {
        if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(formattedValue)) {
          // Formato já está correto (Mercosul)
        } else {
          formattedValue = formattedValue.replace(/^([A-Z]{3})([0-9]{4}).*/, '$1-$2');
        }
      }
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'year') {
      const yearValue =
        value === ''
          ? new Date().getFullYear()
          : Math.max(1900, Math.min(2100, parseInt(String(value)) || 0));
      setFormData((prev) => ({ ...prev, [name]: yearValue }));
    } else if (name === 'branch' || name === 'driver') {
      // Convert to number or undefined for branch and driver
      setFormData((prev) => ({ ...prev, [name]: value ? Number(value) : undefined }));
    } else if (name === 'status') {
      // Ensure status is one of the allowed values
      setFormData((prev) => ({
        ...prev,
        [name]: value as 'active' | 'maintenance' | 'inactive',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // Removendo o campo company antes de enviar para as funções do hook
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { company, ...vehicleData } = formData;

      if (isEditMode) {
        await updateVehicle(Number(id), vehicleData);
        setSnackbar({
          open: true,
          message: 'Veículo atualizado com sucesso!',
          severity: 'success',
        });
      } else {
        await createVehicle(vehicleData);
        setSnackbar({
          open: true,
          message: 'Veículo cadastrado com sucesso!',
          severity: 'success',
        });
      }
      setTimeout(() => {
        if (preselectedCompanyId) {
          navigate(`/companies/${preselectedCompanyId}`);
        } else {
          navigate('/vehicles');
        }
      }, 1200);
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao salvar veículo.',
        severity: 'error',
      });
    }
  };

  const isLoading = vehicleLoading || driversLoading || loadingBranches;

  if (loading || loadingCompanies) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
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
        aria-label="Cabeçalho do formulário de veículo"
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
          <DirectionsCar sx={{ fontSize: 24, color: '#fff' }} />
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
          id="vehicle-form-title"
          tabIndex={0}
        >
          {id ? 'Editar Veículo' : 'Novo Veículo'}
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
            <form onSubmit={handleSubmit} aria-label="Formulário de veículo" autoComplete="on">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Placa"
                    name="plate"
                    value={formData.plate}
                    onChange={handleChange}
                    required
                    error={!!error}
                    helperText={error}
                    inputProps={{ 'aria-label': 'Placa do veículo', tabIndex: 0 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.02)',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Modelo"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    error={!!error}
                    helperText={error}
                    inputProps={{ 'aria-label': 'Modelo do veículo', tabIndex: 0 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.02)',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Marca"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    error={!!error}
                    helperText={error}
                    inputProps={{ 'aria-label': 'Marca do veículo', tabIndex: 0 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.02)',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ano"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    error={!!error}
                    helperText={error}
                    inputProps={{
                      'aria-label': 'Ano do veículo',
                      tabIndex: 0,
                      min: 1900,
                      max: new Date().getFullYear() + 1,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.02)',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cor"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                    error={!!error}
                    helperText={error}
                    inputProps={{ 'aria-label': 'Cor do veículo', tabIndex: 0 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.02)',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="company-label">Empresa do veículo</InputLabel>
                    <Select
                      labelId="company-label"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      label="Empresa do veículo"
                    >
                      {companies.map((company) => (
                        <MenuItem key={company.id} value={company.id}>
                          {company.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      name="status"
                      value={formData.status}
                      label="Status"
                      onChange={handleChange}
                    >
                      <MenuItem value="active">Ativo</MenuItem>
                      <MenuItem value="maintenance">Em Manutenção</MenuItem>
                      <MenuItem value="inactive">Inativo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="branch-label">Filial</InputLabel>
                    <Select
                      labelId="branch-label"
                      name="branch"
                      value={formData.branch?.toString() || ''}
                      label="Filial"
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="">
                        <em>Selecione uma filial</em>
                      </MenuItem>
                      {branches.map((branch) => (
                        <MenuItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="driver-label">Motorista</InputLabel>
                    <Select
                      labelId="driver-label"
                      name="driver"
                      value={formData.driver?.toString() || ''}
                      label="Motorista"
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>Nenhum</em>
                      </MenuItem>
                      {drivers.map((driver) => (
                        <MenuItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                  onClick={() =>
                    preselectedCompanyId
                      ? navigate(`/companies/${preselectedCompanyId}`)
                      : navigate('/vehicles')
                  }
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
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
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
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Zoom>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VehicleForm;
