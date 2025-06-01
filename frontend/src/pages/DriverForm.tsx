import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ptBR } from 'date-fns/locale';
import { useTheme } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { useDriverContext } from '../context/DriverContext';
import { useVehicleContext } from '../context/VehicleContext';
import api from '../services/api';
import { format, parse } from 'date-fns';

interface Branch {
  id: number;
  name: string;
}

const cnhCategories = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'];

const DriverForm = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createDriver, updateDriver, loading: driverLoading } = useDriverContext();
  const { vehicles, fetchVehicles, loading: vehiclesLoading } = useVehicleContext();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    cnh_category: 'B',
    cnh_expiration: format(new Date(), 'yyyy-MM-dd'),
    phone: '',
    email: '',
    branch: '',
    vehicle: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchVehicles();
    fetchBranches();

    if (id) {
      fetchDriverDetails();
    }
  }, [id]);

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

  const fetchDriverDetails = async () => {
    try {
      const response = await api.get(`/company/drivers/${id}/`);
      const driverData = response.data;

      setFormData({
        name: driverData.name || '',
        license_number: driverData.license_number || '',
        cnh_category: driverData.cnh_category || 'B',
        cnh_expiration: driverData.cnh_expiration || format(new Date(), 'yyyy-MM-dd'),
        phone: driverData.phone || '',
        email: driverData.email || '',
        branch: driverData.branch || '',
        vehicle: driverData.vehicle || '',
      });
    } catch (error) {
      console.error('Erro ao carregar detalhes do motorista:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar detalhes do motorista. Tente novamente.',
        severity: 'error',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({ ...formData, [name]: value });
      // Limpar erro quando o campo é alterado
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        cnh_expiration: format(date, 'yyyy-MM-dd'),
      });
      if (errors.cnh_expiration) {
        setErrors({ ...errors, cnh_expiration: '' });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.license_number.trim()) {
      newErrors.license_number = 'Número da CNH é obrigatório';
    }

    if (!formData.cnh_expiration) {
      newErrors.cnh_expiration = 'Data de validade da CNH é obrigatória';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.branch) {
      newErrors.branch = 'Filial é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const driverData = {
      ...formData,
      branch: formData.branch ? Number(formData.branch) : undefined,
      vehicle: formData.vehicle ? Number(formData.vehicle) : undefined,
    };

    console.log('Enviando dados do motorista:', driverData);

    try {
      if (id) {
        await updateDriver(Number(id), driverData);
        setSnackbar({
          open: true,
          message: 'Motorista atualizado com sucesso!',
          severity: 'success',
        });
      } else {
        await createDriver(driverData);
        setSnackbar({
          open: true,
          message: 'Motorista cadastrado com sucesso!',
          severity: 'success',
        });
      }
      setTimeout(() => {
        navigate('/drivers');
      }, 1200);
    } catch (error: any) {
      console.error('Erro ao salvar motorista:', error);
      const errorMessage =
        error.response?.data?.detail ||
        (typeof error.response?.data === 'object'
          ? Object.entries(error.response.data)
              .map(
                ([field, messages]: [string, any]) =>
                  `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
              )
              .join('; ')
          : 'Erro ao salvar motorista. Tente novamente.');

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isLoading = driverLoading || vehiclesLoading || loadingBranches;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4,
        }}
        role="region"
        aria-label="Cabeçalho do formulário de motorista"
      >
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
          id="driver-form-title"
          tabIndex={0}
        >
          {id ? 'Editar Motorista' : 'Novo Motorista'}
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome do motorista"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Número da CNH"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              required
              error={!!errors.license_number}
              helperText={errors.license_number}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="cnh-category-label">Categoria da CNH</InputLabel>
              <Select
                labelId="cnh-category-label"
                id="cnh-category"
                name="cnh_category"
                value={formData.cnh_category}
                label="Categoria da CNH"
                onChange={handleChange}
              >
                {cnhCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Validade da CNH"
                value={parse(formData.cnh_expiration, 'yyyy-MM-dd', new Date())}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.cnh_expiration,
                    helperText: errors.cnh_expiration,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              error={!!errors.phone}
              helperText={errors.phone}
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
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.branch}>
              <InputLabel id="branch-label">Filial</InputLabel>
              <Select
                labelId="branch-label"
                id="branch"
                name="branch"
                value={formData.branch}
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
              {errors.branch && <FormHelperText>{errors.branch}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="vehicle-label">Veículo</InputLabel>
              <Select
                labelId="vehicle-label"
                id="vehicle"
                name="vehicle"
                value={formData.vehicle}
                label="Veículo"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Nenhum</em>
                </MenuItem>
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate} - {vehicle.model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Salvar'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => navigate('/drivers')}
              >
                Cancelar
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DriverForm;
