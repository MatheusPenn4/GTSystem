import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { useTheme } from '@mui/material/styles';
import { useParking } from '../hooks/useParking';
import api from '../services/api';

interface ParkingFormData {
  name: string;
  address: string;
  description: string;
  capacity: number;
  isActive: boolean;
}

const ParkingForm = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    createParkingMutation,
    updateParkingMutation,
    error: hookError,
    success,
    clearMessages,
  } = useParking();

  const [formData, setFormData] = useState<ParkingFormData>({
    name: '',
    address: '',
    description: '',
    capacity: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    if (id) {
      fetchParkingDetails();
    }
  }, [id]);

  useEffect(() => {
    if (success) {
      setSnackbar({
        open: true,
        message: success,
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/estacionamentos');
      }, 1200);
    }
  }, [success, navigate]);

  useEffect(() => {
    if (hookError) {
      setSnackbar({
        open: true,
        message: hookError,
        severity: 'error',
      });
    }
  }, [hookError]);

  const fetchParkingDetails = async () => {
    try {
      const response = await api.get(`/parking/lots/${id}/`);
      const parkingData = response.data;

      setFormData({
        name: parkingData.name || '',
        address: parkingData.address || '',
        description: parkingData.description || '',
        capacity: parkingData.capacity || 0,
        isActive: parkingData.isActive !== false,
      });
    } catch (error) {
      console.error('Erro ao carregar detalhes do estacionamento:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar detalhes do estacionamento. Tente novamente.',
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
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacidade deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const parkingData = {
      ...formData,
      capacity: Number(formData.capacity),
    };

    try {
      if (id) {
        await updateParkingMutation.mutateAsync({ id: Number(id), data: parkingData });
      } else {
        await createParkingMutation.mutateAsync(parkingData);
      }
    } catch (error: any) {
      console.error('Erro ao salvar estacionamento:', error);
      const errorMessage =
        error.response?.data?.detail ||
        (typeof error.response?.data === 'object'
          ? Object.entries(error.response.data)
              .map(
                ([field, messages]: [string, any]) =>
                  `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
              )
              .join('; ')
          : 'Erro ao salvar estacionamento. Tente novamente.');

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
    clearMessages();
  };

  const isLoading = createParkingMutation.isPending || updateParkingMutation.isPending;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        {id ? 'Editar Estacionamento' : 'Novo Estacionamento'}
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome do estacionamento"
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
              label="Capacidade"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              required
              error={!!errors.capacity}
              helperText={errors.capacity}
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
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="isActive"
                value={formData.isActive.toString()}
                label="Status"
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
              >
                <MenuItem value="true">Ativo</MenuItem>
                <MenuItem value="false">Inativo</MenuItem>
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
                onClick={() => navigate('/estacionamentos')}
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

export default ParkingForm;
