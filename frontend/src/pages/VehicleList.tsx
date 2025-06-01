import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  useTheme,
  Fade,
  Zoom,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon,
  Build as BuildIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Search as SearchIcon,
  ColorLens as ColorIcon,
  CalendarToday as CalendarIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useVehicleContext } from '../context/VehicleContext';

const VehicleList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { vehicles, loading, error, fetchVehicles, deleteVehicle } = useVehicleContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleDeleteClick = (id: number) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (vehicleToDelete === null) return;

    try {
      setDeleteInProgress(true);
      await deleteVehicle(vehicleToDelete);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
    } finally {
      setDeleteInProgress(false);
      setVehicleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      (vehicle.plate && vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.brand && vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.color && vehicle.color.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusChip = (status?: string) => {
    if (!status || status === 'active') {
      return (
        <Chip
          icon={<ActiveIcon fontSize="small" />}
          label="Ativo"
          size="small"
          color="success"
          variant="outlined"
          sx={{ borderRadius: '12px' }}
        />
      );
    } else if (status === 'maintenance') {
      return (
        <Chip
          icon={<BuildIcon fontSize="small" />}
          label="Em Manutenção"
          size="small"
          color="warning"
          variant="outlined"
          sx={{ borderRadius: '12px' }}
        />
      );
    } else {
      return (
        <Chip
          icon={<InactiveIcon fontSize="small" />}
          label="Inativo"
          size="small"
          color="error"
          variant="outlined"
          sx={{ borderRadius: '12px' }}
        />
      );
    }
  };

  // Função para obter cor de fundo baseada na cor do veículo
  const getVehicleColorBg = (color?: string) => {
    if (!color) return '#e0e0e0';

    const colorMap: Record<string, string> = {
      branco: '#FFFFFF',
      preto: '#212121',
      prata: '#9E9E9E',
      cinza: '#757575',
      vermelho: '#D32F2F',
      azul: '#1976D2',
      verde: '#388E3C',
      amarelo: '#FBC02D',
      laranja: '#F57C00',
      marrom: '#795548',
      bege: '#D7CCC8',
      dourado: '#FFD700',
      roxo: '#7B1FA2',
      rosa: '#EC407A',
    };

    const lowerColor = color.toLowerCase();
    return colorMap[lowerColor] || '#e0e0e0';
  };

  // Função para determinar se o texto deve ser branco ou preto com base na cor de fundo
  const getTextColor = (bgColor: string) => {
    // Cores escuras que precisam de texto branco
    const darkColors = [
      '#212121',
      '#757575',
      '#D32F2F',
      '#1976D2',
      '#388E3C',
      '#795548',
      '#7B1FA2',
    ];
    return darkColors.includes(bgColor) ? '#FFFFFF' : '#212121';
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

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
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
            Veículos
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
            placeholder="Buscar veículos..."
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: { sm: '250px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                backgroundColor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              },
            }}
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
              onClick={() => fetchVehicles()}
              sx={{
                borderRadius: '20px',
                whiteSpace: 'nowrap',
                minWidth: isMobile ? '100%' : 'auto',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              Atualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/vehicles/new')}
              sx={{
                borderRadius: '20px',
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, #1a237e 60%, #1976d2 100%)'
                    : 'linear-gradient(90deg, #3b4cca 60%, #1a237e 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(90deg, #1976d2 60%, #1a237e 100%)'
                      : 'linear-gradient(90deg, #1a237e 60%, #3b4cca 100%)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
                whiteSpace: 'nowrap',
                minWidth: isMobile ? '100%' : 'auto',
              }}
            >
              Novo Veículo
            </Button>
          </Box>
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

      {vehicles.length === 0 ? (
        <Card
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 4,
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(18,32,47,0.95) 0%, rgba(26,35,126,0.85) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(232,234,246,0.8) 100%)',
            backdropFilter: 'blur(8px)',
            border:
              theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid rgba(26,35,126,0.08)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
          }}
        >
          <CarIcon
            sx={{
              fontSize: 80,
              color: theme.palette.primary.main,
              opacity: 0.6,
              mb: 2,
            }}
          />
          <Typography variant="h5" gutterBottom>
            Nenhum veículo cadastrado
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Clique no botão &quot;Novo Veículo&quot; para adicionar um veículo ao sistema.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/vehicles/new')}
            sx={{
              mt: 2,
              borderRadius: '20px',
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #1a237e 60%, #1976d2 100%)'
                  : 'linear-gradient(90deg, #3b4cca 60%, #1a237e 100%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            Novo Veículo
          </Button>
        </Card>
      ) : (
        <>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            {filteredVehicles.length === 0
              ? 'Nenhum veículo encontrado'
              : `Exibindo ${filteredVehicles.length} veículos`}
          </Typography>

          <Grid container spacing={3}>
            {filteredVehicles.map((vehicle, index) => {
              const bgColor = getVehicleColorBg(vehicle.color);
              const textColor = getTextColor(bgColor);

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={vehicle.id}>
                  <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.02)',
                          boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          height: 160,
                          backgroundColor: bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.2) 100%)',
                            opacity: 0.6,
                            zIndex: 1,
                          },
                        }}
                      >
                        <CarIcon
                          sx={{
                            fontSize: 80,
                            color: textColor,
                            opacity: 0.8,
                            position: 'relative',
                            zIndex: 2,
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1) rotate(5deg)',
                            },
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            p: 1.5,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(0,0,0,0.2)',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          <Chip
                            label={vehicle.plate}
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '1rem',
                              height: 'auto',
                              py: 0.5,
                              px: 1,
                              borderRadius: '12px',
                              background: 'rgba(255,255,255,0.9)',
                              color: '#000',
                              border: '2px solid rgba(0,0,0,0.2)',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                background: 'rgba(255,255,255,1)',
                              },
                            }}
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
                                sx={{
                                  bgcolor: 'rgba(255,255,255,0.9)',
                                  '&:hover': {
                                    bgcolor: 'rgba(255,255,255,1)',
                                    transform: 'rotate(15deg) scale(1.1)',
                                  },
                                  transition: 'all 0.2s ease',
                                  zIndex: 10,
                                  position: 'relative',
                                  width: 30,
                                  height: 30,
                                  pointerEvents: 'auto',
                                  cursor: 'pointer',
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(vehicle.id)}
                                sx={{
                                  bgcolor: 'rgba(255,255,255,0.9)',
                                  '&:hover': {
                                    bgcolor: 'rgba(255,200,200,0.9)',
                                    transform: 'rotate(-15deg) scale(1.1)',
                                    color: theme.palette.error.main,
                                  },
                                  transition: 'all 0.2s ease',
                                  zIndex: 10,
                                  position: 'relative',
                                  width: 30,
                                  height: 30,
                                  pointerEvents: 'auto',
                                  cursor: 'pointer',
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>

                      <CardContent sx={{ p: 2, flexGrow: 1 }}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {vehicle.model || 'Sem modelo'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {vehicle.brand || 'Sem marca'} • {vehicle.year || 'Sem ano'}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ColorIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Cor:</strong> {vehicle.color || 'Não informada'}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Filial:</strong> {vehicle.branch_name || 'Não definida'}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Motorista:</strong> {vehicle.driver_name || 'Não atribuído'}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SpeedIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Status:</strong> {getStatusChip(vehicle.status)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(18,32,47,0.95) 0%, rgba(26,35,126,0.85) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,250,0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border:
              theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid rgba(200,200,230,0.3)',
            overflow: 'hidden',
          },
        }}
        TransitionComponent={Zoom}
      >
        <Box
          sx={{
            position: 'relative',
            p: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: theme.palette.error.main,
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
            },
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
            }}
          >
            <Avatar sx={{ bgcolor: theme.palette.error.main }}>
              <DeleteIcon />
            </Avatar>
            <Typography variant="h6" component="span">
              Confirmar exclusão
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 3, pt: 2 }}>
            <DialogContentText id="alert-dialog-description">
              Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
            <Button
              onClick={handleDeleteCancel}
              color="primary"
              disabled={deleteInProgress}
              variant="outlined"
              sx={{
                borderRadius: '20px',
                px: 3,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              autoFocus
              disabled={deleteInProgress}
              startIcon={deleteInProgress ? <CircularProgress size={20} /> : <DeleteIcon />}
              variant="contained"
              sx={{
                borderRadius: '20px',
                px: 3,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(211,47,47,0.3)',
                },
              }}
            >
              {deleteInProgress ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default VehicleList;
