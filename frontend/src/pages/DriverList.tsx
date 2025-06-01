import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  useTheme,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  Grid,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CreditCard as LicenseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDriverContext } from '../context/DriverContext';

const DriverList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { drivers, loading, error, fetchDrivers, deleteDriver } = useDriverContext();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleDeleteClick = (id: number) => {
    setDriverToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (driverToDelete === null) return;
    try {
      await deleteDriver(driverToDelete);
      setDeleteDialogOpen(false);
      fetchDrivers();
    } catch (error) {
      console.error('Erro ao excluir motorista:', error);
    } finally {
      setDriverToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDriverToDelete(null);
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.license_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 4,
          gap: 2,
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
            <PersonIcon sx={{ fontSize: 24, color: '#fff' }} />
          </Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              letterSpacing: '-1px',
            }}
          >
            Motoristas
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <TextField
            placeholder="Buscar motoristas..."
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: { sm: '250px' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchDrivers}
              disabled={loading}
            >
              Atualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/drivers/new')}
            >
              Novo Motorista
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Error */}
      {error && (
        <Fade in>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Fade>
      )}

      {/* Content */}
      {drivers.length === 0 && !loading ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <PersonIcon
            sx={{ fontSize: 80, color: theme.palette.primary.main, opacity: 0.6, mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            Nenhum motorista cadastrado
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Clique no botão "Novo Motorista" para adicionar um motorista ao sistema.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/drivers/new')}
          >
            Novo Motorista
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredDrivers.map((driver, index) => (
            <Grid item xs={12} md={6} key={driver.id}>
              <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px 0 rgba(31,38,135,0.15)',
                    },
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      borderBottom: '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                          {driver.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Chip
                            icon={<ActiveIcon fontSize="small" />}
                            label="Ativo"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/drivers/edit/${driver.id}`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(driver.id)}
                          sx={{ '&:hover': { color: theme.palette.error.main } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Content */}
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LicenseIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>CNH:</strong> {driver.license_number} ({driver.cnh_category})
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Telefone:</strong> {driver.phone}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Email:</strong> {driver.email}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Filial:</strong> {driver.branch_name || 'Não definida'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este motorista? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverList;
